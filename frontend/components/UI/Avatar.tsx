import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { styled } from "../../stitches.config";
import Flex from "../Primitives/Flex";

const AvatarRoot = styled(AvatarPrimitive.Root, Flex);

const AvatarImage = styled(AvatarPrimitive.Image, {
  size: "100%",
  objectFit: "cover",
  borderRadius: "inherit",
});

const AvatarFallback = styled(AvatarPrimitive.Fallback, {});

type AvatarType = {
  src: string;
  size: number;
};

const Avatar: React.FC<AvatarType> = ({ src, size }) => {
  return (
    <AvatarRoot css={{ size }}>
      <AvatarImage src={src} />
      <AvatarFallback delayMs={600} />
    </AvatarRoot>
  );
};

export default Avatar;
