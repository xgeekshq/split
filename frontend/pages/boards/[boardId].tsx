import { GetStaticProps, GetStaticPaths } from "next";
import { useEffect } from "react";
import { useStoreContext } from "../../store/store";

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      slug: context.params?.boardId,
    },
  };
};

// hardcoded while we dont have backend
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { boardId: "new-board" } }],
    fallback: false,
  };
};

const Board: React.FC<{ slug: string }> = ({ slug }) => {
  const {
    state: { title },
    dispatch,
  } = useStoreContext();

  useEffect(() => {
    dispatch({ type: "setTitle", val: slug });
  }, [dispatch, slug, title]);

  return <>{slug}</>;
};

export default Board;
