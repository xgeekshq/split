import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { styled } from "../../stitches.config";
import Flex from "./Flex";

const AvatarRoot = styled(AvatarPrimitive.Root, Flex, {
  border: "1px solid $colors$white",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  verticalAlign: "middle",
  overflow: "hidden",
  userSelect: "none",
  borderRadius: "100%",
  textAlign: "center",
});

const AvatarImage = styled(AvatarPrimitive.Image, {
  size: "100%",
  objectFit: "cover",
  borderRadius: "inherit",
});

const AvatarFallback = styled(AvatarPrimitive.Fallback, {
  textAlign: "center",
});

type AvatarType = {
  colors: { bg: string; fontColor: any };
  fallbackText: string;
  src?: string;
  size?: number;
};

type AvatarProps = AvatarType & React.ComponentProps<typeof AvatarRoot>;

const Avatar: React.FC<AvatarProps> = ({ src, size, colors, fallbackText, css }) => {
  return (
    <AvatarRoot
      css={{
        size,
        backgroundColor: colors.bg,
        ...css,
        filter: "drop-shadow(0px 1px 4px rgba(18, 25, 34, 0.05))",
      }}
    >
      <AvatarImage src={src} />
      <AvatarFallback
        css={{
          fontSize: "$12",
          fontWeight: "$medium",
          fontFamily: "DM Sans",
          color: colors.fontColor,
          "& span": "",
        }}
      >
        {fallbackText}
      </AvatarFallback>
    </AvatarRoot>
  );
};

export default Avatar;
