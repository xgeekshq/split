import React from "react";
import { CSS } from "../../stitches.config";
import Svg from "../Primitives/Svg";

interface PlusCircleProps {
  css?: CSS;
}

const PlusCircle: React.FC<PlusCircleProps> = ({ css }) => {
  PlusCircle.defaultProps = {
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
      <circle cx="12.8418" cy="12" r="11.5" fill="currentColor" stroke="#434D5A" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.484 7.50168C13.484 7.14664 13.1961 6.85883 12.8411 6.85883C12.4861 6.85883 12.1982 7.14664 12.1982 7.50168V11.3588H8.3411C7.98606 11.3588 7.69824 11.6466 7.69824 12.0017C7.69824 12.3567 7.98606 12.6445 8.3411 12.6445H12.1982V16.5017C12.1982 16.8567 12.4861 17.1445 12.8411 17.1445C13.1961 17.1445 13.484 16.8567 13.484 16.5017V12.6445H17.3411C17.6961 12.6445 17.984 12.3567 17.984 12.0017C17.984 11.6466 17.6961 11.3588 17.3411 11.3588H13.484V7.50168Z"
        fill="currentColor"
      />
    </Svg>
  );
};

export default PlusCircle;
