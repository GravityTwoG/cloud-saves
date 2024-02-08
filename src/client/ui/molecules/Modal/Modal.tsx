import React, { useEffect, useState, ReactNode } from "react";
import { clsx } from "clsx";
import classes from "./modal.module.scss";

import { ReactTagProps } from "@/client/ui/types";

import { Button } from "@/client/ui/atoms/Button/Button";
import { ModalPortal } from "./Portal";

export type ModalProps = {
  closeModal: () => void;
  isOpen: boolean;
  title?: ReactNode;
  bodyStyle?: ReactTagProps<"div">["style"];
  children?: ReactNode;
};

export const Modal: React.FC<ModalProps> = ({
  closeModal,
  isOpen,
  title,
  bodyStyle,
  ...props
}) => {
  const [delayedIsOpen, setDelayedIsOpen] = useState(isOpen);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeModal();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", onEsc, { capture: false });
    }

    return () => document.removeEventListener("keydown", onEsc);
  }, [closeModal, isOpen]);

  useEffect(() => {
    if (isOpen && !delayedIsOpen) {
      setDelayedIsOpen(true);
    } else if (!isOpen && delayedIsOpen) {
      const timeout = setTimeout(() => setDelayedIsOpen(false), 150);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, delayedIsOpen]);

  return (
    <ModalPortal>
      {(isOpen || delayedIsOpen) && (
        <div
          className={clsx(
            classes.Modal,
            isOpen && delayedIsOpen && classes.ModalOpen
          )}
          onClick={closeModal}
        >
          <style>{`body { overflow: hidden; }`}</style>

          <div
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              classes.ModalBody,
              isOpen && delayedIsOpen && classes.ModalOpen
            )}
            style={bodyStyle}
          >
            <div className={classes.ModalHeader}>
              <div className={classes.ModalTitle}>{title}</div>
              <Button onClick={closeModal}>X</Button>
            </div>

            {props.children}
          </div>
        </div>
      )}
    </ModalPortal>
  );
};
