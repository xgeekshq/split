import React, { Dispatch, useState } from "react";
import Button from "../../Primitives/Button";
import Flex from "../../Primitives/Flex";
import { styled } from "../../../stitches.config";
import Text from "../../Primitives/Text";
import { SignUpEnum } from "../../../utils/signUp.enum";
import { OrSeparator } from "../LoginForm/styles";
import useUser from "../../../hooks/useUser";

const Container = styled(Flex, { width: "100%" });

interface SignUpOptionsFormProps {
  setShowSignUp: Dispatch<React.SetStateAction<SignUpEnum>>;
  emailName: string;
  setEmailName: Dispatch<React.SetStateAction<{ email: string; goback: boolean }>>;
}

const SignUpOptionsForm: React.FC<SignUpOptionsFormProps> = ({
  setShowSignUp,
  emailName,
  setEmailName,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loginErrorCode, setLoginErrorCode] = useState(-1);
  const { loginAzure } = useUser(setLoginErrorCode);

  const handleEmailChange = () => {
    setEmailName((prev) => ({ ...prev, goback: true }));
    return setShowSignUp(SignUpEnum.SIGN_UP);
  };

  // const [ShowLogIn, setShowLogIn] = useState(false);
  return (
    <Container direction="column">
      <Text size="md">
        The email
        <Text size="md" fontWeight="medium">
          {` ${emailName} `}
        </Text>
        {/* {`${textContent}`} */}
        supports login with company SSO (Single Sign-on)
      </Text>
      <Button
        type="submit"
        size="lg"
        css={{
          mt: "$32",
          mb: "$22",
          fontWeight: "$medium",
          fontSize: "$18",
          "& svg": {
            height: "$40 !important",
            width: "$40 !important",
          },
        }}
        onClick={loginAzure}
      >
        Log in
      </Button>
      <OrSeparator>
        <hr />
        <Text size="sm" color="primary300" weight="medium">
          or
        </Text>
        <hr />
      </OrSeparator>
      <Text
        size="sm"
        fontWeight="medium"
        underline="true"
        css={{
          alignSelf: "center",
          mt: "$22",
          "&:hover": {
            textDecorationLine: "underline",
            cursor: "pointer",
          },
        }}
        onClick={handleEmailChange}
      >
        Change email
      </Text>
    </Container>
  );
};

export default SignUpOptionsForm;
