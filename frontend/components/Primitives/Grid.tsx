import { ReactNode } from "react";
import { styled } from "../../stitches.config";

const Div = styled("div");

interface Props {
  columns: number[];
  children: ReactNode[];
}

const Grid: React.FC<Props> = ({ columns, children }) => {
  return (
    <Div css={{ display: "flex", width: "100%" }}>
      {children?.map((child, index) => (
        <Div
          css={{
            flex: columns[index],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {child}
        </Div>
      ))}
    </Div>
  );
};

export default Grid;
