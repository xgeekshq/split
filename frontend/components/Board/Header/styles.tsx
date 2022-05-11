import { styled } from "../../../stitches.config";

const StyledHeader = styled("div", {
  width: "100%",

  padding: "$24 $37",
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

const TitleSection = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$10",
});

const FlexSection = styled("section", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 20,

  "&>div:first-of-type": {
    display: "flex",
    flexDirection: "column",
  },

  "&>div:nth-of-type(2)": {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
});

export { StyledHeader, StyledLogo, TitleSection, FlexSection };
