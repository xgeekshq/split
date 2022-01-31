import { Dispatch, SetStateAction } from "react";
import Text from "../../Primitives/Text";
import ResizableTextArea from "../../Primitives/ResizableTextArea";

interface TextItemProps {
  editText: boolean;
  newText: string;
  setNewText: Dispatch<SetStateAction<string>>;
  text: string;
}

const TextItem: React.FC<TextItemProps> = ({ editText, newText, setNewText, text }) => {
  if (!editText) return <Text css={{ wordBreak: "break-word" }}>{text}</Text>;
  return <ResizableTextArea value={newText} editText={setNewText} border={false} edit />;
};

export default TextItem;
