import { Dispatch, SetStateAction, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import router from 'next/router';
import { RedirectableProviderType } from 'next-auth/providers';
import { signIn } from 'next-auth/react';
import { useSetRecoilState } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Dots from '@/components/Primitives/Loading/Dots/Dots';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Input from '@/components/Primitives/Inputs/Input/Input';
import Text from '@/components/Primitives/Text/Text';
import SchemaLoginForm from '@/schema/schemaLoginForm';
import { toastState } from '@/store/toast/atom/toast.atom';
import { LoginUser } from '@/types/user/user';
import {
  AUTH_SSO,
  GUEST_USER_COOKIE,
  NEXT_PUBLIC_ENABLE_AZURE,
  NEXT_PUBLIC_ENABLE_GIT,
  NEXT_PUBLIC_ENABLE_GOOGLE,
  NEXT_PUBLIC_LOGIN_SSO_ONLY,
} from '@/utils/constants';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import Button from '@/components/Primitives/Inputs/Button/Button';
import { getCookie, deleteCookie } from 'cookies-next';
import loginWithAzure from '@/hooks/auth/loginWithAzure';
import Separator from '@/components/Primitives/Separator/Separator';
import { FlexForm } from '@/styles/pages/pages.styles';

import LoginSSO from '@/components/auth/LoginForm/LoginSSO';

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
      setToastState({
        open: true,
        type: ToastStateEnum.ERROR,
        content: result.error,
      });
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
        <Text size="md" color="primary500" css={{ mt: '$8' }}>
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
          data-testid="forgot-password-button"
          variant="link"
          size="sm"
          css={{ color: '$primary500', mt: '$16' }}
          onClick={handleShowTroubleLogginIn}
        >
          Forgot password
        </Button>
        {AUTH_SSO && (
          <Flex align="center" direction="column" justify="center">
            <Flex align="center" css={{ width: '100%', my: '$26' }} gap="16">
              <Separator />
              <Text color="primary300" size="sm" fontWeight="medium">
                OR
              </Text>
              <Separator />
            </Flex>
            <Flex gap="32">
              {NEXT_PUBLIC_ENABLE_GIT && (
                <Button size="xl" isIcon>
                  <Icon size={60} name="github" />
                </Button>
              )}
              {NEXT_PUBLIC_ENABLE_GOOGLE && (
                <Button size="xl" isIcon>
                  <Icon size={60} name="google" />
                </Button>
              )}
              {NEXT_PUBLIC_ENABLE_AZURE && (
                <Button size="xl" isIcon data-loading={loading.sso} onClick={handleLoginAzure}>
                  <Icon size={60} name="microsoft" />
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
