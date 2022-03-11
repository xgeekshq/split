import { globalCss } from "../stitches.config";

const globalStyles = globalCss({
  "*": {
    boxSizing: "border-box",
  },
  body: {
    bc: "$background",
    margin: 0,
    fontFamily: "DM Sans",
    fontWeight: "$regular",
    fontSize: "$16",
    lineHeight: "$24",
    minHeight: "100vh",
  },
  "#__next": {
    minHeight: "100vh",
  },
});

export default globalStyles;
