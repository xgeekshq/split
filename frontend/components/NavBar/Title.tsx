import { useRouter } from "next/router";
import { useStoreContext } from "../../store/store";
import Text from "../Primitives/Text";

const Title: React.FC = () => {
  const router = useRouter();
  const {
    state: { title },
  } = useStoreContext();
  const isBoardPage = router.pathname.startsWith("/boards/");

  const pageTitle = (
    <Text fontWeight="semiBold" size="xl">
      {title}
    </Text>
  );

  return <>{!isBoardPage && pageTitle}</>;
};

export default Title;
