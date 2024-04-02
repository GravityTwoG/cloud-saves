import { Button, ButtonProps } from "@/client/ui/atoms/Button/Button";
import { useConfirmModal } from "../../hooks/useConfirmModal/useConfirmModal";

export type ConfirmButtonProps = Omit<
  ButtonProps,
  "onClick" | "onDoubleClick"
> & {
  onClick?: () => void;
  prompt?: string;
};

export const ConfirmButton = (props: ConfirmButtonProps) => {
  const { onClick, modal } = useConfirmModal({
    onConfirm: props.onClick,
    prompt: props.prompt,
  });

  return (
    <>
      <Button {...props} onClick={onClick} />
      {modal}
    </>
  );
};
