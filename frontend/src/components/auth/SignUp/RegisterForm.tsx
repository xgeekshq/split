import React, { Dispatch, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import router from 'next/router';
import { RedirectableProviderType } from 'next-auth/providers';
import { signIn } from 'next-auth/react';
import { useSetRecoilState } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';
import { AxiosError } from 'axios';

import { styled } from '@/styles/stitches/stitches.config';

import { registerNewUser } from '@/api/authService';
import Icon from '@/components/icons/Icon';
import Button from '@/components/Primitives/Button';
import Flex from '@/components/Primitives/Flex';
import Input from '@/components/Primitives/Input';
import Text from '@/components/Primitives/Text';
import SchemaRegisterForm from '@/schema/schemaRegisterForm';
import { toastState } from '@/store/toast/atom/toast.atom';
import { RegisterUser, User } from '@/types/user/user';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import { SignUpEnum } from '@/utils/signUp.enum';

const StyledForm = styled('form', Flex, { width: '100%' });

const GoBackWrapper = styled(Flex, {
  mt: '$24',
  textAlign: 'center',
  '&:hover': {
    textDecorationLine: 'underline',
    cursor: 'pointer',
  },
});

interface RegisterFormProps {
  emailName: { email: string; goback: boolean };
  setShowSignUp: Dispatch<React.SetStateAction<SignUpEnum>>;
  setCurrentTab: Dispatch<React.SetStateAction<string>>;
  setEmailName: Dispatch<React.SetStateAction<{ email: string; goback: boolean }>>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  setShowSignUp,
  emailName,
  setCurrentTab,
  setEmailName,
}) => {
  const setToastState = useSetRecoilState(toastState);
  const methods = useForm<RegisterUser>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    },
    resolver: joiResolver(SchemaRegisterForm),
  });

  const clearErrors = () => {
    setToastState((prev) => ({ ...prev, open: false }));
  };

  const handleShowSignUp = () => {
    setEmailName((prev) => ({ ...prev, goback: true }));
    clearErrors();
    setShowSignUp(SignUpEnum.SIGN_UP);
  };

  const handleLogin = async () => {
    const result = await signIn<RedirectableProviderType>('credentials', {
      ...methods.getValues(),
      callbackUrl: DASHBOARD_ROUTE,
      redirect: false,
    });
    if (!result?.error) {
      router.push(DASHBOARD_ROUTE);
    }
  };

  const createUser = useMutation<User, AxiosError, RegisterUser, unknown>(
    (user: RegisterUser) => registerNewUser(user),
    {
      mutationKey: 'register',
      onError: () => {
        setToastState({
          open: true,
          type: ToastStateEnum.ERROR,
          content: 'Something went wrong, please try again',
        });
      },
      onSuccess: () => {
        setShowSignUp(SignUpEnum.SIGN_UP);
        setCurrentTab('login');
        handleLogin();
      },
    },
  );

  const handleRegister = async (user: RegisterUser) => {
    user.email = user.email.toLowerCase();
    createUser.mutate(user);
  };

  useEffect(() => {
    methods.setValue('email', emailName.email);
  }, [methods, emailName.email]);

  return (
    <FormProvider {...methods}>
      <StyledForm
        direction="column"
        style={{ width: '100%' }}
        onSubmit={methods.handleSubmit((credentials: RegisterUser) => {
          handleRegister(credentials);
        })}
      >
        <Text css={{ mt: '$24' }} heading="1">
          Sign up
        </Text>
        <Text css={{ mt: '$8', mb: '$16', color: '$primary500' }} size="md">
          Put in your credentials or ask your admin to add your email to the company’s azure
          database.
        </Text>
        <Input disabled id="email" placeholder="Email address" state="default" type="text" />
        <Input id="firstName" placeholder="First Name" type="text" />
        <Input id="lastName" placeholder="Last Name" type="text" />
        <Input
          helperText="Use at least 8 characters, upper and lower case letters, numbers and symbols like !”?$%^&)."
          icon="eye"
          iconPosition="right"
          id="password"
          placeholder="Password"
          type="password"
        />
        <Input
          icon="eye"
          iconPosition="right"
          id="passwordConf"
          placeholder="Confirm Password"
          type="password"
        />
        <Button
          size="lg"
          type="submit"
          css={{
            mt: '$24',
            fontWeight: '$medium',
            fontSize: '$18',
            '& svg': {
              height: '$40 !important',
              width: '$40 !important',
            },
          }}
        >
          Sign up
        </Button>
        <GoBackWrapper align="center" gap="8" onClick={handleShowSignUp}>
          <Icon css={{ width: '$20', height: '$20' }} name="arrow-long-left" />
          <Text>Go back</Text>
        </GoBackWrapper>
      </StyledForm>
    </FormProvider>
  );
};

export default RegisterForm;
