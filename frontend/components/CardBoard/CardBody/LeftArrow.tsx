import React from "react";
import LateralUpArrow from "../../icons/LateralUpArrow";
import StartArrow from "../../icons/StartArrow";
import Flex from "../../Primitives/Flex";

type LeftArrowProps = {
  isDashboard: boolean;
  index: number | undefined;
};

const LeftArrow = ({ isDashboard, index }: LeftArrowProps) => {
  return (
    <Flex>
      <Flex css={{ position: "relative", size: 0 }}>
        {(isDashboard || index === 0) && (
          <Flex css={{ mt: "$11", ml: "$8", mr: "$8" }}>
            <LateralUpArrow />
          </Flex>
        )}
        {!isDashboard && index !== 0 && (
          <Flex css={{ mt: "$2", ml: "13px", mr: "$4", position: "relative", bottom: "42px" }}>
            <StartArrow />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default LeftArrow;
