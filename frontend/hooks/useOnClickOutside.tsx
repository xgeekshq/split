import { RefObject, SetStateAction, useEffect } from "react";

const useOnClickOutside = (
  ref: RefObject<HTMLDivElement>,
  handler: (value: SetStateAction<boolean>) => void
): void => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const eventTarget = event.target as Node;
      if (!ref.current || ref.current.contains(eventTarget) || eventTarget.textContent === "Yes") {
        return;
      }
      handler(true);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

export default useOnClickOutside;
