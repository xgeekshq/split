import { ReactElement } from 'react';

import { useRouter } from 'next/router';

import AccessLayout from '@/components/layouts/AccessLayout/AccessLayout';

import { FormProvider, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';

import Button from '@/components/Primitives/Inputs/Button/Button';
import Input from '@/components/Primitives/Inputs/Input/Input';
import Text from '@/components/Primitives/Text/Text';
import SchemaResetPasswordForm from '@/schema/schemaResetPasswordForm';
import { NewPassword } from '@/types/user/user';
import useResetPassword from '@/hooks/auth/useResetPassword';
import { FlexForm } from '@/styles/pages/pages.styles';

const ResetPasswordPage = () => {
  const router = useRouter();
  const tokenId = (router.query.tokenId || '') as string;

  const { mutate } = useResetPassword();

  const methods = useForm<NewPassword>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      newPassword: '',
      newPasswordConf: '',
    },
    resolver: joiResolver(SchemaResetPasswordForm),
  });

  const handleRecoverPassword = (params: NewPassword) => {
    mutate(params, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <FlexForm
        direction="column"
        onSubmit={methods.handleSubmit((params) => {
          handleRecoverPassword({ ...params, token: tokenId });
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
      </FlexForm>
    </FormProvider>
  );
};

ResetPasswordPage.getLayout = (page: ReactElement) => <AccessLayout>{page}</AccessLayout>;

export default ResetPasswordPage;
