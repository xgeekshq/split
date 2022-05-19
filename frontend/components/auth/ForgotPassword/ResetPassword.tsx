import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import SchemaResetPasswordForm from "../../../schema/schemaResetPasswordForm";
import { styled } from "../../../stitches.config";
import Button from "../../Primitives/Button";
import Flex from "../../Primitives/Flex";
import LogoIcon from "../../icons/Logo";
import Input from "../../Primitives/Input";
import Text from "../../Primitives/Text";
import { NewPassword } from "../../../types/user/user";
import useUser from "../../../hooks/useUser";
import { ToastStateEnum } from "../../../utils/enums/toast-types";
import { toastState } from "../../../store/toast/atom/toast.atom";

const MainContainer = styled("form", Flex, {
  width: "$500",
  backgroundColor: "$white",
  boxShadow: "0px 4px 54px rgba(0, 0, 0, 0.5)",
  borderRadius: "$12",
  py: "$48",
  px: "$32",
});

interface ResetPasswordProps {
  token: string;
  setUserToken: Dispatch<SetStateAction<string | undefined>>;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ token, setUserToken }) => {
  const setToastState = useSetRecoilState(toastState);
  const router = useRouter();
  const methods = useForm<NewPassword>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      password: "",
      passwordConf: "",
    },
    resolver: zodResolver(SchemaResetPasswordForm),
  });

  const { resetPassword } = useUser();

  const handleRecoverPassword = async (params: NewPassword) => {
    params.token = token;
    const res = await resetPassword.mutateAsync(params);
    if (res.message) {
      setToastState({
        open: true,
        type: ToastStateEnum.ERROR,
        content: "Something went wrong,please try again.",
      });
      return;
    }

    setUserToken(undefined);

    router.push("/");
    setToastState({
      open: true,
      type: ToastStateEnum.SUCCESS,
      content: "Password updated successfully",
    });
  };
  return (
    <MainContainer
      direction="column"
      onSubmit={methods.handleSubmit((params) => {
        handleRecoverPassword(params);
      })}
    >
      <FormProvider {...methods}>
        <LogoIcon />
        <Text css={{ mt: "$24" }} heading="1">
          Reset Password
        </Text>
        <Text size="md" css={{ mt: "$8", color: "$primary500" }}>
          Enter your new password
        </Text>
        <Input
          css={{ mt: "$32" }}
          id="newPassword"
          type="password"
          placeholder="Type password here"
        />
        <Input
          css={{ mt: "$32" }}
          id="newPasswordConf"
          type="password"
          placeholder="Repeat password"
        />
        <Button
          type="submit"
          size="lg"
          css={{
            mt: "$32",
            fontWeight: "$medium",
            fontSize: "$18",
          }}
        >
          Recover password
        </Button>
      </FormProvider>
    </MainContainer>
  );
};

export default ResetPassword;
