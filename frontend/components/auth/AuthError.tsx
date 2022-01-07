import React from "react";
import Flex from "../Primitives/Flex";
import Text from "../Primitives/Text";

interface Props {
  text: string;
}

const AuthError: React.FC<Props> = ({ text }) => {
  return (
    <Flex>
      <Text
        color="red"
        css={{
          mb: "$16",
          backgroundColor: "$red5",
          fontWeight: "bold",
          p: "$16",
          width: "100%",
        }}
      >
        {text}
      </Text>
    </Flex>
  );
};

export default AuthError;
