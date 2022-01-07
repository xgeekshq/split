import { ReactText } from "react";
import { toast, TypeOptions } from "react-toastify";

const ToastMessage = (message: string, type: TypeOptions): ReactText =>
  toast(message, {
    type,
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

export default ToastMessage;
