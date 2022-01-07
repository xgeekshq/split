import React from "react";
import { styled } from "../../stitches.config";

const Span = styled("span", {
  color: "$accent",
  cursor: "pointer",
  fontWeight: "bold",

  variants: {
    type: {
      secondary: {
        color: "black",
        textDecoration: "underline",
        fontWeight: "normal",
      },
    },
  },
});

type Props = {
  text: string;
  onClick: () => void;
} & React.ComponentProps<typeof Span>;

const TextButton: React.FC<Props> = ({ text, onClick, type }) => {
  return (
    <Span onClick={onClick} type={type}>
      {text}
    </Span>
  );
};

export default TextButton;
