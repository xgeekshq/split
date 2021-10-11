import { useCallback, useMemo } from "react";
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

  const pageTitle = useMemo(
    () => (
      <Text fontWeight="semiBold" size="xl">
        {title}
      </Text>
    ),
    [title]
  );

  const HandleContent = useCallback(() => {
    if (!isBoardPage) {
      return pageTitle;
    }
    return <div />;
  }, [isBoardPage, pageTitle]);

  const content = HandleContent();

  return <>{content}</>;
};

export default Title;
