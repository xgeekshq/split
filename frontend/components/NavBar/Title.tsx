import { useContext } from "react";
import TitleContext from "../../store/title-context";
import Text from "../Primitives/Text";

const Title: React.FC = () => {
  const titleCtx = useContext(TitleContext);

  return (
    <Text fontWeight="semiBold" size="xl">
      {titleCtx.title}
    </Text>
  );
};

export default Title;
