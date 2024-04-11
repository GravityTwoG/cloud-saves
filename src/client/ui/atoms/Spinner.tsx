import SpinnerIcon from "@/client/ui/icons/Spinner.svg";

export type SpinnerProps = {
  className?: string;
};

export const Spinner = (props: SpinnerProps) => {
  return <SpinnerIcon className={props.className} />;
};
