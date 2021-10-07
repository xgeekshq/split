import { GetStaticProps, GetStaticPaths } from "next";
import { useEffect, useRef } from "react";
import { useStoreContext } from "../../store/store-context";

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

  const isFirstRun = useRef(true);

  useEffect(() => {
    dispatch({ type: "setTitle", val: slug });
    console.log("slug");
    if (isFirstRun.current) {
      isFirstRun.current = false;
    } else if (!isFirstRun.current) {
      // update on server
    }
  }, [dispatch, slug, title]);

  return (
    <>
      <button
        type="button"
        onClick={() => dispatch({ type: "setTitle", val: Math.random().toString() })}
      >
        aaaa
      </button>
    </>
  );
};

export default Board;
