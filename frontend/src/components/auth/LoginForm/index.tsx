import { Dispatch, SetStateAction, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import router from 'next/router';
import { RedirectableProviderType } from 'next-auth/providers';
import { signIn } from 'next-auth/react';
import { joiResolver } from '@hookform/resolvers/joi';
import { deleteCookie, getCookie } from 'cookies-next';
import { useSetRecoilState } from 'recoil';

import LoginSSO from '@/components/auth/LoginForm/LoginSSO';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Input from '@/components/Primitives/Inputs/Input/Input';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Dots from '@/components/Primitives/Loading/Dots/Dots';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import {
  AUTH_SSO,
  GUEST_USER_COOKIE,
  NEXT_PUBLIC_ENABLE_AZURE,
  NEXT_PUBLIC_ENABLE_GIT,
  NEXT_PUBLIC_ENABLE_GOOGLE,
  NEXT_PUBLIC_LOGIN_SSO_ONLY,
} from '@/constants';
import { DASHBOARD_ROUTE } from '@/constants/routes';
import { createErrorMessage } from '@/constants/toasts';
import loginWithAzure from '@/hooks/auth/loginWithAzure';
import SchemaLoginForm from '@/schema/schemaLoginForm';
import { toastState } from '@/store/toast/atom/toast.atom';
import { FlexForm } from '@/styles/pages/pages.styles';
import { LoginUser } from '@/types/user/user';

interface LoginFormProps {
  setShowTroubleLogin: Dispatch<SetStateAction<boolean>>;
}

const LoginForm = ({ setShowTroubleLogin }: LoginFormProps) => {
  const [loading, setLoading] = useState({ credentials: false, sso: false });
  const setToastState = useSetRecoilState(toastState);

  const methods = useForm<LoginUser>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: joiResolver(SchemaLoginForm),
  });

  const handleLoginAzure = () => {
    if (loading.sso) return;
    // deletes guest user cookies after login
    if (getCookie(GUEST_USER_COOKIE)) deleteCookie(GUEST_USER_COOKIE);
    setLoading((prevState) => ({ ...prevState, sso: true }));
    loginWithAzure();
  };

  const handleLogin = async (credentials: LoginUser) => {
    setLoading((prevState) => ({ ...prevState, credentials: true }));
    const result = await signIn<RedirectableProviderType>('credentials', {
      ...credentials,
      callbackUrl: DASHBOARD_ROUTE,
      redirect: false,
    });
    if (!result?.error) {
      // deletes guest user cookies after login
      if (getCookie(GUEST_USER_COOKIE)) deleteCookie(GUEST_USER_COOKIE);
      setToastState((prev) => ({ ...prev, open: false }));
      router.push(DASHBOARD_ROUTE);
      return;
    }

    if (result.error) {
      methods.reset();
      setToastState(createErrorMessage(result.error));
    }

    setLoading((prevState) => ({ ...prevState, credentials: false }));
  };

  const handleShowTroubleLogginIn = () => {
    setShowTroubleLogin(true);
  };

  return NEXT_PUBLIC_LOGIN_SSO_ONLY ? (
    <LoginSSO handleLoginAzure={handleLoginAzure} />
  ) : (
    <FormProvider {...methods}>
      <FlexForm
        autoComplete="off"
        direction="column"
        onSubmit={methods.handleSubmit((credentials: LoginUser) => {
          handleLogin(credentials);
        })}
      >
        <Text css={{ mt: '$24' }} heading="1">
          Welcome
        </Text>
        <Text color="primary500" css={{ mt: '$8' }} size="md">
          Enter your email and password to log in.
        </Text>
        <Input css={{ mt: '$32' }} id="email" placeholder="Email address" type="text" />
        <Input
          icon="eye"
          iconPosition="right"
          id="password"
          placeholder="Password"
          type="password"
        />

        <Button disabled={loading.credentials} size="lg" type="submit">
          {loading.credentials && <Dots color="primary800" size={10} />}
          {!loading.credentials && 'Log in'}
        </Button>
        <Button
          css={{ color: '$primary500', mt: '$16' }}
          data-testid="forgot-password-button"
          onClick={handleShowTroubleLogginIn}
          size="sm"
          variant="link"
        >
          Forgot password
        </Button>
        {AUTH_SSO && (
          <Flex align="center" direction="column" justify="center">
            <Flex align="center" css={{ width: '100%', my: '$26' }} gap="16">
              <Separator />
              <Text color="primary300" fontWeight="medium" size="sm">
                OR
              </Text>
              <Separator />
            </Flex>
            <Flex gap="32">
              {NEXT_PUBLIC_ENABLE_GIT && (
                <Button isIcon size="xl">
                  <Icon name="github" size={60} />
                </Button>
              )}
              {NEXT_PUBLIC_ENABLE_GOOGLE && (
                <Button isIcon size="xl">
                  <Icon name="google" size={60} />
                </Button>
              )}
              {NEXT_PUBLIC_ENABLE_AZURE && (
                <Button
                  isIcon
                  data-loading={loading.sso}
                  disabled={loading.sso}
                  onClick={handleLoginAzure}
                  size="xl"
                  type="button"
                >
                  {loading.sso && <Dots color="primary800" size={10} />}
                  {!loading.sso && <Icon name="microsoft" size={60} />}
                </Button>
              )}
            </Flex>
          </Flex>
        )}
      </FlexForm>
    </FormProvider>
  );
};

export default LoginForm;
