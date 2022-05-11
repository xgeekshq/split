import type * as Stitches from "@stitches/react";
import { config } from "../../stitches.config";
import Svg from "../Primitives/Svg";

type CSSProps = { css?: Stitches.CSS<typeof config> };

type PlusIconProps = { size?: string } & CSSProps;

const PlusIcon: React.FC<PlusIconProps> = ({ size, ...rest }) => {
  if (size === "16")
    return (
      <Svg
        {...rest}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/Svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.75 2.75C8.75 2.33579 8.41421 2 8 2C7.58579 2 7.25 2.33579 7.25 2.75V7.25H2.75C2.33579 7.25 2 7.58579 2 8C2 8.41421 2.33579 8.75 2.75 8.75H7.25V13.25C7.25 13.6642 7.58579 14 8 14C8.41421 14 8.75 13.6642 8.75 13.25V8.75H13.25C13.6642 8.75 14 8.41421 14 8C14 7.58579 13.6642 7.25 13.25 7.25H8.75V2.75Z"
          fill="currentColor"
        />
      </Svg>
    );
  return (
    <Svg
      {...rest}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.9375 3.4375C10.9375 2.91973 10.5178 2.5 10 2.5C9.48223 2.5 9.0625 2.91973 9.0625 3.4375V9.0625H3.4375C2.91973 9.0625 2.5 9.48223 2.5 10C2.5 10.5178 2.91973 10.9375 3.4375 10.9375H9.0625V16.5625C9.0625 17.0803 9.48223 17.5 10 17.5C10.5178 17.5 10.9375 17.0803 10.9375 16.5625V10.9375H16.5625C17.0803 10.9375 17.5 10.5178 17.5 10C17.5 9.48223 17.0803 9.0625 16.5625 9.0625H10.9375V3.4375Z"
        fill="currentColor"
      />
    </Svg>
  );
};

export default PlusIcon;
