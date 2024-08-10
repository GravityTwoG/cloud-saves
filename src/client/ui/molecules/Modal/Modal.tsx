import React, { ReactNode, RefObject, useCallback, useEffect, useRef } from "react";
import { clsx } from "clsx";
import classes from "./modal.module.scss";

import { ReactTagProps } from "@/client/ui/types";
import { useOnKeyDown } from "@/client/ui/hooks/useOnKeyDown";

import { Button } from "@/client/ui/atoms/Button";
import { ModalPortal } from "./Portal";
import { useDelayedFalse } from "../../hooks/useDelayedFalse";

const visibleModals: RefObject<Element | null>[] = [];

function peek<T>(array: T[]): T | null {
  return array[array.length - 1];
}

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
  const delayedIsOpen = useDelayedFalse(isOpen, 150);

  const modalRef = useRef<HTMLDivElement>(null);

  // Add the overlay ref to the stack of visible overlays on mount, and remove on unmount.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    visibleModals.push(modalRef);

    return () => {
      const index = visibleModals.indexOf(modalRef);
      if (index !== -1) {
        visibleModals.splice(index, 1);
      }
    };
  }, [isOpen]);

  const onClose = useCallback(() => {
    if (peek(visibleModals) === modalRef) {
      closeModal();
    }
  }, [closeModal]);

  useOnKeyDown(
    "Escape",
    (e) => {
      if (isOpen) {
        e.stopPropagation();
        onClose();
      }
    },
    [onClose, isOpen],
  );

  return (
    <ModalPortal>
      {(isOpen || delayedIsOpen) && (
        <div
          className={clsx(
            classes.Modal,
            "custom-scrollbar",
            isOpen && delayedIsOpen && classes.ModalOpen,
          )}
          onClick={onClose}
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
              {showCloseButton && <Button onClick={onClose}>X</Button>}
            </div>

            {props.children}
          </div>
        </div>
      )}
    </ModalPortal>
  );
};
