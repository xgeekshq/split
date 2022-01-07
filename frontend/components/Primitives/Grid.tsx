import { ReactNode } from "react";
import Div from "./Div";

type Props = {
  columns: number[];
  children: ReactNode[];
  alignItems?: string[];
  justifyContent?: string[];
};

const Grid: React.FC<Props> = (props) => {
  const { columns, children, alignItems = [], justifyContent = [] } = props;

  return (
    <Div css={{ display: "flex", width: "100%" }}>
      {children?.map((child, index) => (
        <Div
          css={{
            flex: columns[index],
            display: "flex",
            alignItems: alignItems[index] || "normal",
            justifyContent: justifyContent[index] || "normal",
          }}
        >
          {child}
        </Div>
      ))}
    </Div>
  );
};

export default Grid;
