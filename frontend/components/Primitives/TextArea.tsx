import { styled } from "../../stitches.config";

const TextArea = styled("textarea", {
  overflow: "hidden",
  overflowWrap: "break-word",
  resize: "none",
  height: "auto",
  minHeight: "$32",
  width: "$220",
});

export default TextArea;
