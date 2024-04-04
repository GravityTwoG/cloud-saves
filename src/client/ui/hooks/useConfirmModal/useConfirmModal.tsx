import { useState } from "react";

import classes from "./confirm-modal.module.scss";

import { Button } from "@/client/ui/atoms/Button";
import { Modal } from "@/client/ui/molecules/Modal";

export type UseConfirmModalArgs = {
  onConfirm?: () => void;
  prompt?: string;
};

export const useConfirmModal = (args: UseConfirmModalArgs) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    if (!args.onConfirm) {
      return;
    }

    setIsOpen(true);
  };

  const modal = (
    <Modal
      title={args.prompt || "Confirm action"}
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
            args.onConfirm?.();
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
  );

  return {
    isOpen,
    onClick,
    modal,
  };
};
