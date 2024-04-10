import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";

import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

import { useParams } from "wouter";
import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";
import {
  CommonGraphic,
  CommonGraphicData,
  HistogramData,
  PieChartData,
} from "@/types";

import { H1 } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container";
import { Preloader } from "@/client/ui/molecules/Preloader";
import { GraphicForm } from "./components/GraphicForm";
import { Flex } from "@/client/ui/atoms/Flex";

export const GraphicPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "pages.graphic" });
  const { t: tCommon } = useTranslation(undefined, { keyPrefix: "common" });
  const { graphicsAPI } = useAPIContext();
  const { notify } = useUIContext();

  const [isLoading, setIsLoading] = useState(false);
  const [graphic, setGraphic] = useState<CommonGraphic | null>(null);
  const { graphicId } = useParams();

  useEffect(() => {
    const loadGraphic = async () => {
      if (!graphicId) return;
      try {
        setIsLoading(true);
        const g = await graphicsAPI.getCommonGraphic(graphicId);
        setGraphic(g);
      } catch (e) {
        notify.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadGraphic();
  }, [graphicsAPI, graphicId]);

  if (!graphic && !isLoading) {
    return (
      <Container className="my-4">
        <H1>{tCommon("not-found")}</H1>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <H1>{t("graphic")}</H1>

      <Preloader isLoading={isLoading}>
        {graphic && <GraphicForm defaultValue={graphic} />}
      </Preloader>

      <Flex jcc className="my-4">
        {graphicId && <GraphicView graphicId={graphicId} />}
      </Flex>
    </Container>
  );
};

type GraphicViewProps = {
  graphicId: string;
};

const GraphicView = (props: GraphicViewProps) => {
  const [graphic, setGraphic] = useState<CommonGraphicData | null>(null);
  const { graphicsAPI } = useAPIContext();

  useEffect(() => {
    graphicsAPI
      .getCommonGraphicData(props.graphicId)
      .then((graphic) => {
        setGraphic(graphic);
      })
      .catch(console.error);
  }, [props.graphicId]);

  if (!graphic) return null;

  if (isHistogramGraphic(graphic)) {
    return <HistogramGraphic graphic={graphic} />;
  }

  if (isPieChartGraphic(graphic)) {
    return <PieChartGraphic graphic={graphic} />;
  }

  return null;
};

function isHistogramGraphic(
  graphic: CommonGraphicData
): graphic is CommonGraphicData & { data: HistogramData } {
  return graphic.visualType === "histogram";
}

function isPieChartGraphic(
  graphic: CommonGraphicData
): graphic is CommonGraphicData & { data: PieChartData } {
  return graphic.visualType === "piechart";
}

type HistogramGraphicProps = {
  graphic: Omit<CommonGraphicData, "data"> & { data: HistogramData };
};

const HistogramGraphic = (props: HistogramGraphicProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const data = props.graphic.data.map((d) => ({
      min: d.range.min,
      max: d.range.max,
      height: d.height,
    }));

    const plot = Plot.plot({
      marks: [
        Plot.rectY(data, {
          x1: "min",
          x2: "max",
          y: "height",
          title: (d) => `[${d.min} - ${d.max}]: ${d.height}`,
          inset: 5,
        }),
      ],
      title: `Histogram of ${props.graphic.commonParameter.label}`,
      caption: props.graphic.commonParameter.description,
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, [props.graphic.data]);

  return <div ref={containerRef} />;
};

type PieChartGraphicProps = {
  graphic: Omit<CommonGraphicData, "data"> & { data: PieChartData };
};

const PieChartGraphic = (props: PieChartGraphicProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const data = props.graphic.data;
    const rotation = 0;
    const plot = Plot.plot({
      projection: {
        // equal-area is crucial to maintain comparability of the slices,
        // but it could be any other equal-area projection
        type: "azimuthal-equal-area",
        rotate: [0, rotation - 90],
      },
      marks: [
        pie(data, {
          value: "percentage",
          fill: "label",
          title: (d) => `${d.label} (${d.percentage}%)`,
        }),
      ],
      title: `Pie chart of ${props.graphic.commonParameter.label}`,
      caption: props.graphic.commonParameter.description,
    });

    containerRef.current.append(plot);

    return () => plot.remove();
  }, [props.graphic.data]);

  return <div ref={containerRef} />;
};

const pie = <T extends Record<string, number | string>>(
  data: T[],
  { value, ...options }: { value: keyof T } & Plot.GeoOptions
) => {
  const coordinates = toPieCoordinates(data, value);

  return Plot.geo(
    {
      type: "GeometryCollection",
      geometries: data.map((dataElem, i) => ({
        type: "Polygon",
        ...dataElem,
        coordinates: coordinates[i],
      })),
    },
    options
  );
};

const toPieCoordinates = <T extends Record<string, number | string>>(
  data: T[],
  value: keyof T
) => {
  const cs = d3.cumsum(data, (d) => d[value] as number);

  const r = 360 / cs[cs.length - 1];
  for (let i = 0; i < cs.length; ++i) cs[i] *= r;

  const coordinates = [];

  for (let i = 0; i < data.length; ++i) {
    const a = -(cs[i - 1] || 0);
    const b = -cs[i];

    coordinates.push([
      [
        [0, 90],
        [a, 0],
        [(2 * a + b) / 3, 0], // add intermediate points for sectors larger than a half-circle
        [(a + 2 * b) / 3, 0],
        [b, 0],
        [0, 90],
      ],
    ]);
  }

  return coordinates;
};
