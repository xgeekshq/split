import React from "react";
import { styled } from "@stitches/react";

interface Props {
  text: string;
  onClick: () => void;
}

const Span = styled("span", {
  color: "-webkit-link",
  cursor: "pointer",
  textDecoration: "underline",
});

const TextButton: React.FC<Props> = ({ text, onClick }) => {
  return <Span onClick={onClick}>{text}</Span>;
};

export default TextButton;
