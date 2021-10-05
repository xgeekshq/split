import { useContext, useEffect } from "react";
import TitleContext from "../../store/title-context";

const Board: React.FC = () => {
  const context = useContext(TitleContext);

  useEffect(() => console.log("new"), [context.title]);
  return (
    <>
      <button type="button" onClick={() => context.setTitle(Math.random().toString())}>
        aaaa
      </button>
    </>
  );
};

export default Board;
