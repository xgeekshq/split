import { styled } from "../../../stitches.config";
import Flex from "../../Primitives/Flex";
import Button from "../../Primitives/Button";

const StyledForm = styled("form", Flex, { width: "100%" });

const LoginButton = styled(Button, {
  fontWeight: "$medium",
  "& svg": {
    height: "$40 !important",
    width: "$40 !important",
  },
});

const StyledHoverIconFlex = styled("div", Flex, {
  "&:hover": {
    "&[data-loading='true']": {
      cursor: "default",
    },
    "&[data-loading='false']": {
      cursor: "pointer",
    },
  },
});

const OrSeparator = styled("div", {
  display: "flex",
  alignItems: "center",

  width: "100%",

  mt: "$24",
  mb: "$32",

  hr: {
    flexGrow: 1,
    height: 1,
    margin: 0,
    border: 0,
    backgroundColor: "$primary100",
  },

  span: {
    px: "$14",
    textTransform: "uppercase !important",
  },
});

export { StyledHoverIconFlex, StyledForm, LoginButton, OrSeparator };
