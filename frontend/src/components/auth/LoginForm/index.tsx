import { Dispatch, SetStateAction, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import router from 'next/router';
import { RedirectableProviderType } from 'next-auth/providers';
import { signIn } from 'next-auth/react';
import { useSetRecoilState } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Dots from '@/components/Primitives/Loading/Dots';
import Flex from '@/components/Primitives/Layout/Flex';
import Input from '@/components/Primitives/Inputs/Input/Input';
import Text from '@/components/Primitives/Text/Text';
import useUser from '@/hooks/useUser';
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
import { OrSeparator, StyledForm, StyledHoverIconFlex } from './styles';
import LoginSSO from './LoginSSO';

interface LoginFormProps {
  setShowTroubleLogin: Dispatch<SetStateAction<boolean>>;
}

const LoginForm: React.FC<LoginFormProps> = ({ setShowTroubleLogin }) => {
  const [loading, setLoading] = useState({ credentials: false, sso: false });
  const setToastState = useSetRecoilState(toastState);
  const { loginAzure } = useUser();
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
    loginAzure();
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
      <StyledForm
        autoComplete="off"
        direction="column"
        style={{ width: '100%' }}
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
            <OrSeparator>
              <hr />
              <Text color="primary300" size="sm" fontWeight="medium">
                or
              </Text>
              <hr />
            </OrSeparator>
            <Flex gap="32">
              {NEXT_PUBLIC_ENABLE_GIT && (
                <StyledHoverIconFlex>
                  <Icon css={{ width: '$60', height: '$60' }} name="github" />
                </StyledHoverIconFlex>
              )}
              {NEXT_PUBLIC_ENABLE_GOOGLE && (
                <StyledHoverIconFlex>
                  <Icon css={{ width: '$60', height: '$60' }} name="google" />
                </StyledHoverIconFlex>
              )}
              {NEXT_PUBLIC_ENABLE_AZURE && (
                <StyledHoverIconFlex data-loading={loading.sso} onClick={handleLoginAzure}>
                  <Icon css={{ width: '$60', height: '$60' }} name="microsoft" />
                </StyledHoverIconFlex>
              )}
            </Flex>
          </Flex>
        )}
      </StyledForm>
    </FormProvider>
  );
};

export default LoginForm;
