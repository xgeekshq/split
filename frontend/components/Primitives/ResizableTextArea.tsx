import { Dispatch, useEffect, useRef } from "react";
import { styled } from "../../stitches.config";
import ChangeEvent from "../../types/events/onChange";
import TextArea from "./TextArea";

const StyledTextArea = styled(TextArea, {
  width: "stretch",
  outline: "none",
  pl: "$8",
  pt: "$8",
});

interface ResizableTextAreaProps {
  value: string;
  editText: Dispatch<React.SetStateAction<string>>;
  border: boolean;
  edit: boolean;
}

const ResizableTextArea: React.FC<ResizableTextAreaProps> = ({ value, editText, border, edit }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const textAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    editText(event.target.value);
  };

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.value = value;
      textareaRef.current.style.height = "0px";
      const { scrollHeight } = textareaRef.current;
      textareaRef.current.style.height = `${scrollHeight === 42 ? 0 : scrollHeight}px`;
    }
  }, [value]);
  return (
    <StyledTextArea
      placeholder="Add item"
      ref={textareaRef}
      onChange={textAreaChange}
      css={{
        border: border ? "1px solid black" : "none",
        borderRadius: "$4",
        boxShadow: !edit ? "1px 2px 10px rgba(0, 0, 0, 0.2)" : "none",
      }}
    />
  );
};
export default ResizableTextArea;
