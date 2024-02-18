import { toast, Toaster } from "react-hot-toast";

export const notify = {
  ...toast,
  error: (message: unknown) => {
    if (message instanceof Error) {
      return toast.error(message.message);
    }

    return toast.error(message as string);
  },
};

export const ToastsManager = Toaster;
