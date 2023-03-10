import React, { Dispatch, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import router from 'next/router';
import { RedirectableProviderType } from 'next-auth/providers';
import { signIn } from 'next-auth/react';
import { useSetRecoilState } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';

import { styled } from '@/styles/stitches/stitches.config';

import { registerNewUser } from '@/api/authService';
import Icon from '@/components/Primitives/Icon';
import Button from '@/components/Primitives/Button';
import Flex from '@/components/Primitives/Flex';
import Input from '@/components/Primitives/Inputs/Input/Input';
import Text from '@/components/Primitives/Text';
import SchemaRegisterForm from '@/schema/schemaRegisterForm';
import { toastState } from '@/store/toast/atom/toast.atom';
import { RegisterUser } from '@/types/user/user';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import { SignUpEnum } from '@/utils/signUp.enum';

const StyledForm = styled('form', Flex, { width: '100%' });

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
    mode: 'onChange',
    reValidateMode: 'onChange',
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

  const createUser = useMutation((user: RegisterUser) => registerNewUser(user), {
    mutationKey: ['register'],
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
  });

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
        <Text size="md" color="primary500" css={{ mt: '$8', mb: '$16' }}>
          Put in your credentials or ask your admin to add your email to the company’s azure
          database.
        </Text>
        <Input disabled id="email" placeholder="Email address" type="text" />
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
          }}
        >
          Sign up
        </Button>
        <Flex>
          <Button
            variant="link"
            css={{ pl: '0', mt: '$24', color: '$primary500' }}
            onClick={handleShowSignUp}
          >
            <Icon name="arrow-long-left" />
            Go Back
          </Button>
        </Flex>
      </StyledForm>
    </FormProvider>
  );
};

export default RegisterForm;
