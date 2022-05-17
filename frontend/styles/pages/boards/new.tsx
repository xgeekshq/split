import { styled } from "../../../stitches.config";
import Flex from "../../../components/Primitives/Flex";

const Container = styled("main", {
  width: "100%",
  height: "100vh",

  // display: "flex",
  // flexDirection: "column",

  backgroundColor: "$primary50",
  overflowY: "hidden",
});

const PageHeader = styled("header", {
  height: "$92",
  width: "100%",

  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  padding: "$32 $40",

  backgroundColor: "$white",

  button: {
    "& svg": {
      size: "$40 !important",
      color: "$primary800",
    },

    transition: "background-color 0.2s ease-in-out",

    "&:hover": {
      backgroundColor: "$primaryLightest",
    },
  },
});

const ContentContainer = styled("section", {
  display: "flex",

  width: "100%",
  height: "calc(100vh - $sizes$92)",
  maxHeight: "calc(100vh - $sizes$92)",

  overflowY: "hidden !important",
});

const InnerContent = styled(Flex, {
  flex: "1 1 auto",
  width: "100%",
  height: "100%",
  overflow: "auto",

  padding: "64px 92px 57px 152px",
});

const StyledForm = styled("form", Flex, {
  flex: "1 1 auto",
  height: "calc(100vh - $sizes$92)",
});

export { Container, PageHeader, ContentContainer, StyledForm, InnerContent };
