import { useRouter } from "next/router";
import { useStoreContext } from "../../store/store";
import { CheckIsBoardPage } from "../../utils/PagesNames";
import Text from "../Primitives/Text";

const Title: React.FC = () => {
  const router = useRouter();
  const {
    state: { title },
  } = useStoreContext();

  const isBoardPage = CheckIsBoardPage(router.pathname);

  if (!isBoardPage) {
    return (
      <Text fontWeight="semiBold" size="18">
        {title}
      </Text>
    );
  }
  return <div />;
};

export default Title;
