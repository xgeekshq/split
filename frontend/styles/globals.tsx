import { globalCss } from "../stitches.config";

const globalStyles = globalCss({
  "@import": [
    "url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap')",
  ],
  "@font-face": [
    {
      fontFamily: "'DM Sans', sans-serif",
      src: "url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap')",
    },
  ],
  "*": {
    boxSizing: "border-box",
  },
  body: {
    bc: "$background",
    margin: 0,
    fontFamily: "$body",
    fontWeight: "$regular",
    fontSize: "$16",
    lineHeight: "$24",
    minHeight: "100vh",
  },
  "#__next": {
    minHeight: "100vh",
  },
  svg: { verticalAlign: "middle" },
});

export default globalStyles;
