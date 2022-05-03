import { CSSProps } from "../../stitches.config";
import Svg from "../Primitives/Svg";

const VerticalThreeDotsIcon = ({ css }: CSSProps) => {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      css={css}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="9.78253" cy="4.78228" rx="1.44928" ry="1.44928" fill="#2F3742" />
      <circle cx="9.78253" cy="10.0001" r="1.44928" fill="#2F3742" />
      <ellipse cx="9.78253" cy="15.2169" rx="1.44928" ry="1.44927" fill="#2F3742" />
    </Svg>
  );
};

export default VerticalThreeDotsIcon;
