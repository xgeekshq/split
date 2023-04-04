import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { joiResolver } from '@hookform/resolvers/joi';

import { styled } from '@/styles/stitches/stitches.config';

import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Input from '@/components/Primitives/Inputs/Input/Input';
import Text from '@/components/Primitives/Text/Text';
import SchemaResetPasswordForm from '@/schema/schemaResetPasswordForm';
import { NewPassword } from '@/types/user/user';
import useResetPassword from '@/hooks/auth/useResetPassword';
import { useEffect } from 'react';

const MainContainer = styled('form', Flex, {
  width: '100%',
});

interface ResetPasswordProps {
  token: string;
}

const ResetPassword = ({ token }: ResetPasswordProps) => {
  const router = useRouter();
  const methods = useForm<NewPassword>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      newPassword: '',
      newPasswordConf: '',
    },
    resolver: joiResolver(SchemaResetPasswordForm),
  });

  const { mutateAsync, status } = useResetPassword();

  const handleRecoverPassword = async (params: NewPassword) => {
    await mutateAsync(params);
  };

  useEffect(() => {
    if (status === 'success') {
      router.push('/');
    }
  }, [status, router]);

  return (
    <FormProvider {...methods}>
      <MainContainer
        direction="column"
        onSubmit={methods.handleSubmit((params) => {
          handleRecoverPassword({ ...params, token });
        })}
      >
        <Text css={{ mt: '$24' }} heading="1">
          Reset Password
        </Text>
        <Text size="md" color="primary500" css={{ mt: '$8' }}>
          Enter your new password
        </Text>
        <Input
          css={{ mt: '$32' }}
          iconPosition="right"
          icon="eye"
          id="newPassword"
          placeholder="Type new password here"
          type="password"
        />
        <Input
          iconPosition="right"
          icon="eye"
          id="newPasswordConf"
          placeholder="Repeat password"
          type="password"
        />
        <Button size="lg" type="submit">
          Recover password
        </Button>
      </MainContainer>
    </FormProvider>
  );
};

export default ResetPassword;
