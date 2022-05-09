import { styled } from "../../../stitches.config";

const StyledHeader = styled("div", {
  width: "100%",

  padding: "$18",
  borderBottomStyle: "solid",
  borderBottomWidth: 1,
  borderBottomColor: "$primary100",

  backgroundColor: "$surface",
});

const StyledLogo = styled("div", {
  "& svg": {
    width: 16,
    height: 16,
  },

  display: "inline-flex",
  alignItems: "center",
});

const TitleSection = styled("section", {
  display: "flex",
  alignItems: "center",
  gap: "$10",
});

export { StyledHeader, StyledLogo, TitleSection };
