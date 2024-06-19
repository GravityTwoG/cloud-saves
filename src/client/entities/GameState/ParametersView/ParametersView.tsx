import classes from "./parameters-view.module.scss";

import { GameStateValue } from "@/types";

import { Paper } from "@/client/ui/atoms/Paper";
import { NoElements } from "@/client/ui/atoms/NoElements";

type ParametersViewProps = {
  gameStateValues: GameStateValue[];
  className?: string;
};

export const ParametersView = (props: ParametersViewProps) => {
  return (
    <div className={props.className}>
      <ul className={classes.ParametersList}>
        {props.gameStateValues.map((field, idx) => (
          <ParameterViewItem key={idx} {...field} />
        ))}
      </ul>
      {props.gameStateValues.length === 0 && (
        <NoElements className={classes.Empty} />
      )}
    </div>
  );
};

function formatTime(value: number, type: "time_seconds") {
  if (type === "time_seconds") {
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
  if (props.type === "time_seconds") {
    return (
      <li>
        <Paper>
          <div className={classes.ParameterName} title={props.description}>
            {props.label}
          </div>
          <div className={classes.ParameterValue}>
            {formatTime(parseFloat(props.value), props.type)}
          </div>
        </Paper>
      </li>
    );
  }

  return (
    <li>
      <Paper>
        <div className={classes.ParameterName} title={props.description}>
          {props.label}
        </div>
        <div className={classes.ParameterValue}>{props.value.toString()}</div>
      </Paper>
    </li>
  );
};
