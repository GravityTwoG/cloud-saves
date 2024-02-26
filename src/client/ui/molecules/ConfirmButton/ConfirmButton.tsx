import { useState } from "react";

import classes from "./confirm-button.module.scss";

import { Button, ButtonProps } from "@/client/ui/atoms/Button/Button";
import { Modal } from "../Modal/Modal";

export type ConfirmButtonProps = Omit<
  ButtonProps,
  "onClick" | "onDoubleClick"
> & {
  onClick?: () => void;
  prompt?: string;
};

export const ConfirmButton = (props: ConfirmButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    if (!props.onClick) {
      return;
    }

    setIsOpen(true);
  };

  return (
    <>
      <Button {...props} onClick={onClick} />
      <Modal
        title={props.prompt || "Confirm action"}
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        showCloseButton={false}
        headerClassName={classes.ModalHeader}
        bodyClassName={classes.ModalBody}
      >
        <div className={classes.ConfirmActions}>
          <Button
            className={classes.ConfirmAction}
            onClick={() => {
              setIsOpen(false);
              props.onClick?.();
            }}
          >
            Confirm
          </Button>
          <Button
            className={classes.ConfirmAction}
            onClick={() => setIsOpen(false)}
            color="secondary"
            autoFocus
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};
