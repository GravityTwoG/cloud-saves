import { ElementType } from "react";

export type ReactTagProps<T extends ElementType> =
  React.ComponentPropsWithRef<T>;
