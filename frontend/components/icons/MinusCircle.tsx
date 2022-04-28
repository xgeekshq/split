import React from "react";
import { CSS } from "../../stitches.config";
import Svg from "../Primitives/Svg";

interface MinusCircleProps {
  css?: CSS;
}

const MinusCircle: React.FC<MinusCircleProps> = ({ css }) => {
  MinusCircle.defaultProps = {
    css: undefined,
  };
  return (
    <Svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={css}
    >
      <circle cx="12.8418" cy="12" r="11.5" fill="currentColor" stroke="currentColor" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.69824 12.0017C7.69824 11.6466 7.98606 11.3588 8.3411 11.3588H17.3411C17.6961 11.3588 17.984 11.6466 17.984 12.0017C17.984 12.3567 17.6961 12.6445 17.3411 12.6445H8.3411C7.98606 12.6445 7.69824 12.3567 7.69824 12.0017Z"
        fill="currentColor"
      />
    </Svg>
  );
};

export default MinusCircle;
