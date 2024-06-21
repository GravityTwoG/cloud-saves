import React, { ReactNode } from "react";
import { clsx } from "clsx";
import classes from "./modal.module.scss";

import { ReactTagProps } from "@/client/ui/types";
import { useOnKeyDown } from "@/client/ui/hooks/useOnKeyDown";

import { Button } from "@/client/ui/atoms/Button";
import { ModalPortal } from "./Portal";
import { useDelayedFalse } from "../../hooks/useDelayedFalse";

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
  useOnKeyDown(
    "Escape",
    (e) => {
      e.stopPropagation();
      closeModal();
    },
    [closeModal, isOpen],
  );

  const delayedIsOpen = useDelayedFalse(isOpen, 150);

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
