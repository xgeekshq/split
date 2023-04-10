import { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { joiResolver } from '@hookform/resolvers/joi';

import AccessLayout from '@/components/layouts/AccessLayout/AccessLayout';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Input from '@/components/Primitives/Inputs/Input/Input';
import Text from '@/components/Primitives/Text/Text';
import useResetPassword from '@/hooks/auth/useResetPassword';
import SchemaResetPasswordForm from '@/schema/schemaResetPasswordForm';
import { FlexForm } from '@/styles/pages/pages.styles';
import { NewPassword } from '@/types/user/user';

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
        <Text color="primary500" css={{ mt: '$8' }} size="md">
          Enter your new password
        </Text>
        <Input
          css={{ mt: '$32' }}
          icon="eye"
          iconPosition="right"
          id="newPassword"
          placeholder="Type new password here"
          type="password"
        />
        <Input
          icon="eye"
          iconPosition="right"
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
