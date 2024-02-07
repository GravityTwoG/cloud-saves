import { ReactElement, ForwardedRef, ReactNode, forwardRef } from "react";
import { clsx } from "clsx";

import classes from "./segmented-control.module.scss";

export type SegmentNameType = string | boolean | number;

export type Segment<T extends SegmentNameType> = {
  name: T;
  node: ReactNode;
};

export type SegmentedControlProps<T extends SegmentNameType> = {
  segments: Segment<T>[];
  onSelect: (segmentName: T) => void;
  activeSegmentName: T;

  className?: string;
  name?: string;
};

export type SegmentedControlComponent = <T extends SegmentNameType>(
  props: SegmentedControlProps<T> & { ref?: ForwardedRef<HTMLInputElement> }
) => ReactElement | null;

export const SegmentedControl: SegmentedControlComponent = forwardRef(
  (props, ref): ReactElement => {
    return (
      <div className={clsx(classes.SegmentedControl, props.className)}>
        <FakeInput
          segmentName={props.activeSegmentName}
          name={props.name}
          ref={ref}
        />

        <ul className={classes.SegmentsList}>
          {props.segments.map((segment) => (
            <li
              key={segment.name.toString()}
              className={clsx(classes.Segment, {
                [classes.SegmentActive]:
                  segment.name === props.activeSegmentName,
              })}
              role="button"
              onClick={() => {
                if (segment.name !== props.activeSegmentName) {
                  props.onSelect(segment.name);
                }
              }}
            >
              {segment.node}
            </li>
          ))}
        </ul>
      </div>
    );
  }
) as SegmentedControlComponent;

const FakeInput = forwardRef<
  HTMLInputElement,
  { name?: string; segmentName: Segment<string | number | boolean>["name"] }
>((props, ref) => {
  if (typeof props.segmentName === "boolean") {
    return (
      <input
        type="checkbox"
        name={props.name}
        onChange={() => {}}
        ref={ref}
        className={classes.FakeInput}
      />
    );
  }

  return (
    <input
      name={props.name}
      ref={ref}
      className={classes.FakeInput}
      value={props.segmentName}
    />
  );
});
