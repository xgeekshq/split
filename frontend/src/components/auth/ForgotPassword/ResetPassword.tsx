import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';

import { styled } from '@/styles/stitches/stitches.config';

import LogoIcon from '@/components/icons/Logo';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex';
import Input from '@/components/Primitives/Inputs/Input/Input';
import Text from '@/components/Primitives/Text/Text';
import useUser from '@/hooks/useUser';
import SchemaResetPasswordForm from '@/schema/schemaResetPasswordForm';
import { toastState } from '@/store/toast/atom/toast.atom';
import { NewPassword } from '@/types/user/user';
import { ToastStateEnum } from '@/utils/enums/toast-types';

const MainContainer = styled('form', Flex, {
  width: '100%',
});

interface ResetPasswordProps {
  token: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ token }) => {
  const setToastState = useSetRecoilState(toastState);
  const router = useRouter();
  const methods = useForm<NewPassword>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      password: '',
      passwordConf: '',
    },
    resolver: joiResolver(SchemaResetPasswordForm),
  });

  const { resetPassword } = useUser();

  const handleRecoverPassword = async (params: NewPassword) => {
    params.token = token;
    const res = await resetPassword.mutateAsync({ ...params, token });
    if (!res.message) {
      setToastState({
        open: true,
        type: ToastStateEnum.ERROR,
        content: 'Something went wrong,please try again.',
      });
      return;
    }

    router.push('/');
    setToastState({
      open: true,
      type: ToastStateEnum.SUCCESS,
      content: 'Password updated successfully',
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
        <Text css={{ mt: '$24' }} heading="1">
          Reset Password
        </Text>
        <Text size="md" color="primary500" css={{ mt: '$8' }}>
          Enter your new password
        </Text>
        <Input
          css={{ mt: '$32' }}
          helperText="Your Password must be at least 8 characters long"
          icon="eye"
          iconPosition="right"
          id="newPassword"
          placeholder="Type password here"
          type="password"
        />
        <Input
          helperText="Your Password must be at least 8 characters long"
          icon="eye"
          iconPosition="right"
          id="newPasswordConf"
          placeholder="Repeat password"
          type="password"
        />
        <Button size="lg" type="submit">
          Recover password
        </Button>
      </FormProvider>
    </MainContainer>
  );
};

export default ResetPassword;
