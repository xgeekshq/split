import { Dispatch, SetStateAction } from "react";
import Text from "../../Primitives/Text";

interface TextItemProps {
  editText: boolean;
  newText: string;
  setNewText: Dispatch<SetStateAction<string>>;
  text: string;
}

const TextItem: React.FC<TextItemProps> = ({ editText, text }) => {
  if (!editText) return <Text css={{ wordBreak: "break-word" }}>{text}</Text>;
  // return <ResizableTextArea value={newText} editText={setNewText} border={false} edit />;
  return null;
};

export default TextItem;
