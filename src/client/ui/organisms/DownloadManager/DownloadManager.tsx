import { useEffect, useState } from "react";
import { clsx } from "clsx";
import classes from "./download-manager.module.scss";

import { Spoiler } from "../../molecules/Spoiler/Spoiler";
import { DownloadManagerPortal } from "./DownloadManagerPortal";
import { List } from "../../molecules/List/List";

export type DownloadItem = {
  id: string;
  name: string;
  progress: number;
  status: "downloading" | "complete" | "error";
};

export const DownloadManager = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  useEffect(() => {
    setDownloads([
      {
        id: "test",
        name: "Borderlands",
        progress: 10,
        status: "downloading",
      },

      {
        id: "test2",
        name: "GRID 2",
        progress: 100,
        status: "complete",
      },

      {
        id: "test3",
        name: "Black Desert",
        progress: 42,
        status: "error",
      },
    ]);
  }, []);

  return (
    <DownloadManagerPortal>
      <div className={classes.DownloadManager}>
        <Spoiler
          title="Downloads/Uploads"
          expandedClassName={classes.ManagerExpaned}
          closeOnClickOutside
        >
          <div className={classes.Downloads}>
            <List
              elements={downloads}
              renderElement={(download) => (
                <div className={classes.DownloadItem}>
                  <div>{download.name}</div>
                  <ProgressCircle
                    progress={download.progress}
                    status={download.status}
                  />
                </div>
              )}
              getKey={(download) => download.id}
            />
          </div>
        </Spoiler>
      </div>
    </DownloadManagerPortal>
  );
};

type ProgressCircleProps = {
  progress: number;
  status: "downloading" | "complete" | "error";
};

const progressVar: string = "--progress";

const ProgressCircle = (props: ProgressCircleProps) => {
  return (
    <div
      className={clsx(
        classes.ProgressCircle,
        props.status === "error" && classes.Error,
        props.status === "complete" && classes.Complete
      )}
      style={{
        [progressVar]: `${props.progress}%`,
      }}
      data-progress={props.progress}
    />
  );
};
