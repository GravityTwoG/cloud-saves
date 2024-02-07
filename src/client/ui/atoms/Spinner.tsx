import { clsx } from "clsx";

export type SpinnerProps = {
  className?: string;
};

export const Spinner = (props: SpinnerProps) => {
  return (
    <svg
      className={clsx(props.className)}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        background: "none",
        display: "block",
        shapeRendering: "auto",
        stroke: "white",
      }}
      width="100px"
      height="100px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        strokeWidth="6"
        r="35"
        strokeDasharray="164.93361431346415 56.97787143782138"
        transform="rotate(132.005 50 50)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1s"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
        />
      </circle>
    </svg>
  );
};
