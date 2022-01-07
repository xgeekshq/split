import React from "react";
import { styled } from "@stitches/react";

const Span = styled("span", {
  color: "-webkit-link",
  cursor: "pointer",

  variants: {
    type: {
      secondary: {
        color: "black",
        textDecoration: "underline",
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
