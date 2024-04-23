import React, { useEffect, useState, ReactNode } from "react";
import { clsx } from "clsx";
import classes from "./modal.module.scss";

import { ReactTagProps } from "@/client/ui/types";
import { useOnKeyDown } from "@/client/ui/hooks/useOnKeyDown";

import { Button } from "@/client/ui/atoms/Button";
import { ModalPortal } from "./Portal";

export type ModalProps = {
  closeModal: () => void;
  isOpen: boolean;
  title?: ReactNode;
  bodyStyle?: ReactTagProps<"div">["style"];
  children?: ReactNode;
  showCloseButton?: boolean;
  headerClassName?: string;
  bodyClassName?: string;
};

export const Modal: React.FC<ModalProps> = ({
  closeModal,
  isOpen,
  title,
  bodyStyle,
  showCloseButton = true,
  ...props
}) => {
  const [delayedIsOpen, setDelayedIsOpen] = useState(isOpen);

  useOnKeyDown(
    "Escape",
    (e) => {
      e.stopPropagation();
      closeModal();
    },
    [closeModal, isOpen],
  );

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
            "custom-scrollbar",
            isOpen && delayedIsOpen && classes.ModalOpen,
          )}
          onClick={closeModal}
        >
          <style>{`body { overflow: hidden; }`}</style>

          <div
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              classes.ModalBody,
              props.bodyClassName,
              isOpen && delayedIsOpen && classes.ModalOpen,
            )}
            style={bodyStyle}
          >
            <div className={clsx(classes.ModalHeader, props.headerClassName)}>
              <div className={classes.ModalTitle}>{title}</div>
              {showCloseButton && <Button onClick={closeModal}>X</Button>}
            </div>

            {props.children}
          </div>
        </div>
      )}
    </ModalPortal>
  );
};
