import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { FormProvider, useForm } from "react-hook-form";
import SchemaEmail from "../../schema/schemaEmail";
import { styled } from "../../stitches.config";
import Button from "../Primitives/Button";
import Flex from "../Primitives/Flex";
import LeftArrow from "../Primitives/icons/LeftArrow";
import Logo from "../Primitives/icons/logo";
import Input from "../Primitives/Input";
import Text from "../Primitives/Text";

const MainContainer = styled("form", Flex, {
  width: "$500",
  backgroundColor: "$white",
  boxShadow: "0px 4px 54px rgba(0, 0, 0, 0.5)",
  borderRadius: "$12",
  py: "$48",
  px: "$32",
});

interface TroubleLoginProps {
  setShowTroubleLogin: Dispatch<SetStateAction<boolean>>;
}

const TroubleLogin: React.FC<TroubleLoginProps> = ({ setShowTroubleLogin }) => {
  const methods = useForm<{ email: string }>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(SchemaEmail),
  });

  const handleShowTrubleLogginIn = () => {
    setShowTroubleLogin(false);
  };

  const handleRecoverPassword = (email: string) => {
    console.log(email);
  };

  return (
    <MainContainer
      direction="column"
      onSubmit={methods.handleSubmit(({ email }) => {
        handleRecoverPassword(email);
      })}
    >
      <FormProvider {...methods}>
        <Logo />
        <Text css={{ mt: "$24" }} heading="1">
          Trouble logging in?
        </Text>
        <Text size="md" css={{ mt: "$8", color: "$primary500" }}>
          Enter your email address below, well email you instructions on how to change your
          password.
        </Text>
        <Input css={{ mt: "$32" }} id="email" type="text" placeholder="Email address" />
        <Button
          size="lg"
          css={{
            fontWeight: "$medium",
            fontSize: "$18",
          }}
        >
          Recover password
        </Button>
        <Flex
          gap="8"
          align="center"
          css={{ mt: "$24", textAlign: "center" }}
          onClick={handleShowTrubleLogginIn}
        >
          <LeftArrow />
          <Text
            css={{
              "&:hover": {
                textDecorationLine: "underline",
                cursor: "pointer",
              },
            }}
          >
            Go back
          </Text>
        </Flex>
      </FormProvider>
    </MainContainer>
  );
};

export default TroubleLogin;
