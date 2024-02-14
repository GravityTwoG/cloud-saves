import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import classes from "./spoiler.module.scss";
import { useOnClickOutside } from "@/client/lib/hooks/useOnClickOutside";

export type SpoilerProps = {
  children?: React.ReactNode;
  title: React.ReactNode;
  className?: string;
  expandedClassName?: string;
  closeOnClickOutside?: boolean;
};

export const Spoiler = (props: SpoilerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [delayedIsOpen, setDelayedIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && !delayedIsOpen) {
      setDelayedIsOpen(true);
    } else if (!isOpen && delayedIsOpen) {
      const timeout = setTimeout(() => setDelayedIsOpen(false), 150);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, delayedIsOpen]);

  const ref = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(ref, () => {
    if (props.closeOnClickOutside) {
      setIsOpen(false);
    }
  });

  return (
    <div className={clsx(classes.Spoiler, props.className)} ref={ref}>
      <button
        className={classes.SpoilerTitle}
        onClick={() => setIsOpen(!isOpen)}
      >
        {props.title}
      </button>

      {(isOpen || delayedIsOpen) && (
        <div
          className={clsx(
            classes.SpoilerContent,
            isOpen && delayedIsOpen && classes.SpoilerExpanded,
            isOpen && delayedIsOpen && props.expandedClassName
          )}
        >
          {props.children}
        </div>
      )}
    </div>
  );
};
