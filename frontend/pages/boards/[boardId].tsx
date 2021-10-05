import { GetStaticProps, GetStaticPaths } from "next";
import { useContext, useEffect, useRef } from "react";
import TitleContext from "../../store/title-context";

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
  const titleCtx = useContext(TitleContext);

  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      titleCtx.setTitle(slug);
      isFirstRun.current = false;
      console.log("1");
    } else if (!isFirstRun.current) {
      // update on server
      console.log("2");
    }
  }, [slug, titleCtx]);

  return (
    <>
      <button type="button" onClick={() => titleCtx.setTitle(Math.random().toString())}>
        aaaa
      </button>
    </>
  );
};

export default Board;
