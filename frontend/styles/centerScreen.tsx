import { css } from "../stitches.config";

const centerScreen = css({
  backgroundColor: "white",
  borderRadius: "$6",
  boxShadow: "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: 25,
  "&:focus": { outline: "none" },
});

export default centerScreen;
