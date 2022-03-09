import { globalCss } from "../stitches.config";

const globalStyles = globalCss({
  body: {
    bc: "$background",
    margin: 0,
    fontFamily: "DM Sans",
    fontWeight: "$regular",
    fontSize: "$16",
    lineHeight: "$24",
    width: "100vw",
    height: "100vh",
  },
});

export default globalStyles;
