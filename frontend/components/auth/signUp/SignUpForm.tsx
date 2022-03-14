import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch } from "react";
import Button from "../../Primitives/Button";
import Flex from "../../Primitives/Flex";
import Input from "../../Primitives/Input";
import Logo from "../../../public/icons/logo.svg";
import { styled } from "../../../stitches.config";
import Text from "../../Primitives/Text";
import { EmailUser } from "../../../types/user/user";
import SchemaEmail from "../../../schema/schemaEmail";
import { checkUserExistsAD } from "../../../api/authService";
import { SignUpEnum } from "../../../utils/signUp.enum";

const StyledForm = styled("form", Flex, { width: "100%" });

interface SignUpFormProps {
  setShowSignUp: Dispatch<React.SetStateAction<SignUpEnum>>;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ setShowSignUp }) => {
  const methods = useForm<EmailUser>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(SchemaEmail),
  });

  const handleCheckUserExists = async (email: string) => {
    const exists = await checkUserExistsAD(email);
    if (exists) return setShowSignUp(SignUpEnum.SIGN_UP_OPTIONS);
    return setShowSignUp(SignUpEnum.REGISTER);
  };

  return (
    <FormProvider {...methods}>
      <StyledForm
        direction="column"
        style={{ width: "100%" }}
        onSubmit={methods.handleSubmit(({ email }) => {
          handleCheckUserExists(email);
        })}
      >
        <Logo />
        <Text css={{ mt: "$24" }} heading="1">
          Sign up
        </Text>
        <Text size="md" css={{ mt: "$8", color: "$primary500" }}>
          Enter your email address to proceed further
        </Text>
        <Input css={{ mt: "$32" }} id="email" type="text" placeholder="Email address" />

        <Button
          type="submit"
          size="lg"
          css={{
            fontWeight: "$medium",
            fontSize: "$18",
            "& svg": {
              height: "$40 !important",
              width: "$40 !important",
            },
          }}
        >
          {/* {signupErrorCode === 0 && <ThreeDots color="#FFFFF" height={80} width={80} />} */}
          {/* {signupErrorCode !== 0 && "Get Started"} */}
          Get Started
        </Button>
      </StyledForm>
    </FormProvider>
  );
};

export default SignUpForm;
