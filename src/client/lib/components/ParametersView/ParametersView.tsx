import classes from "./parameters-view.module.scss";

import { GameStateValue } from "@/types";

type ParametersViewProps = {
  gameStateValues: GameStateValue[];
};

export const ParametersView = (props: ParametersViewProps) => {
  return (
    <div>
      {props.gameStateValues.map((field, idx) => (
        <ParameterViewItem key={idx} {...field} />
      ))}
      {props.gameStateValues.length === 0 && "-"}
    </div>
  );
};

function formatTime(value: number, type: "seconds") {
  if (type === "seconds") {
    if (value < 60) {
      return `${value} seconds`;
    }
    const minutes = Math.floor(value / 60);

    if (minutes < 60) {
      return `${minutes} minutes`;
    }

    const hours = Math.floor(minutes / 60);

    return `${hours} hours`;
  }

  return `${value}`;
}

const ParameterViewItem = (props: {
  label: string;
  value: string;
  type: string;
  description: string;
}) => {
  if (props.type === "seconds") {
    return (
      <div>
        <span>{props.label}</span>:{" "}
        <span className={classes.ParameterValue}>
          {formatTime(parseFloat(props.value), props.type)}
        </span>
      </div>
    );
  }

  return (
    <div>
      <span>{props.label}</span>:{" "}
      <span className={classes.ParameterValue}>{props.value.toString()}</span>
    </div>
  );
};
