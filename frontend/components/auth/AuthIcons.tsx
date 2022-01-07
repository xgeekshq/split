import Image from "next/image";
import Flex from "../Primitives/Flex";
import IconButton from "../Primitives/IconButton";
import googleIcon from "../../public/social_icons/google.svg";
import githubIcon from "../../public/social_icons/github.svg";
import microsoftIcon from "../../public/social_icons/microsoft.svg";
import { CSS } from "../../stitches.config";

type Props = { src: StaticImageData; css: CSS };

const AuthIcon: React.FC<Props> = ({ src, css }) => {
  return (
    <IconButton variant="filled-circle" size="40" css={css}>
      <Image src={src} height="90" width="90" />
    </IconButton>
  );
};

const AuthIcons: React.FC = () => {
  return (
    <Flex justify="center" css={{ mt: "$20", mb: "$40" }}>
      <AuthIcon src={googleIcon} css={{ ml: "auto" }} />
      <AuthIcon src={githubIcon} css={{ ml: "$20", mr: "$20" }} />
      <AuthIcon src={microsoftIcon} css={{ mr: "auto" }} />
    </Flex>
  );
};

export default AuthIcons;
