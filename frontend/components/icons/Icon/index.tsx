import React from "react";
import Svg from "../../Primitives/Svg";
import { CSSProps } from "../../../stitches.config";

type Props = {
  name: string;
  css?: CSSProps;
};

const Icon = ({ name, css, ...props }: Props) => {
  return (
    <Svg css={css} {...props}>
      <use href={`#${name}`} />
    </Svg>
  );
};

export default Icon;
