import { ReactText } from "react";
import { toast, TypeOptions } from "react-toastify";

const ToastMessage = (message: string, type: TypeOptions): ReactText =>
  toast(message, {
    type,
    position: "bottom-center",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  });

export default ToastMessage;
