import { useState } from "react";

import { Modal } from "@/client/ui/molecules/Modal";
import { ReactTagProps } from "@/client/ui/types";

export type UseModalArgs = {
  children: JSX.Element;
  title: string;
  bodyStyle?: ReactTagProps<"div">["style"];
};

export const useModal = (args: UseModalArgs) => {
  const [isOpen, setIsOpen] = useState(false);

  const modal = (
    <Modal
      title={args.title}
      isOpen={isOpen}
      closeModal={() => setIsOpen(false)}
      bodyStyle={args.bodyStyle}
    >
      {args.children}
    </Modal>
  );

  const openModal = () => setIsOpen(true);

  return [modal, openModal] as const;
};
