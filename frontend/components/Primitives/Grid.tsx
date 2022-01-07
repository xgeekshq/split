import { ReactNode } from "react";
import { CSS, styled } from "../../stitches.config";

const Div = styled("div");

type Props = {
  columns: number[];
  children: ReactNode[];
} & Pick<CSS, "alignItems" | "justifyContent">;

const Grid: React.FC<Props> = (props) => {
  const { columns, children, alignItems = "center", justifyContent = "center" } = props;

  return (
    <Div css={{ display: "flex", width: "100%" }}>
      {children?.map((child, index) => (
        <Div
          css={{
            flex: columns[index],
            display: "flex",
            alignItems,
            justifyContent,
          }}
        >
          {child}
        </Div>
      ))}
    </Div>
  );
};

export default Grid;
