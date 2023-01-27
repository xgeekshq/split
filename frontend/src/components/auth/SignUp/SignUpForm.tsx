import React, { Dispatch, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';

import { styled } from '@/styles/stitches/stitches.config';

import { checkUserExists, checkUserExistsAD } from '@/api/authService';
import Button from '@/components/Primitives/Button';
import Flex from '@/components/Primitives/Flex';
import Input from '@/components/Primitives/Input';
import Text from '@/components/Primitives/Text';
import SchemaEmail from '@/schema/schemaEmail';
import { toastState } from '@/store/toast/atom/toast.atom';
import { EmailUser } from '@/types/user/user';
import { NEXT_PUBLIC_ENABLE_AZURE } from '@/utils/constants';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { SignUpEnum } from '@/utils/signUp.enum';

const StyledForm = styled('form', Flex, { width: '100%' });

interface SignUpFormProps {
  setShowSignUp: Dispatch<React.SetStateAction<SignUpEnum>>;
  setEmailName: Dispatch<React.SetStateAction<{ email: string; goback: boolean }>>;
  emailName: { email: string; goback: boolean };
}

const SignUpForm: React.FC<SignUpFormProps> = ({ setShowSignUp, setEmailName, emailName }) => {
  const setToastState = useSetRecoilState(toastState);
  const [valueState, setValueState] = useState(false);
  const methods = useForm<EmailUser>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: emailName.email,
    },
    resolver: joiResolver(SchemaEmail),
  });
  useQuery(
    ['checkUserExists', emailName],
    () =>
      NEXT_PUBLIC_ENABLE_AZURE
        ? checkUserExistsAD(emailName.email)
        : checkUserExists(emailName.email),
    {
      enabled: !!emailName.email && !emailName.goback,
      suspense: false,
      onSuccess: (data) => {
        if (data === 'az') {
          setShowSignUp(SignUpEnum.SIGN_UP_OPTIONS);
          return;
        }

        if (!data) {
          setShowSignUp(SignUpEnum.REGISTER);
          return;
        }

        methods.setError('email', { type: 'custom', message: 'This email already exists' });
        setValueState(true);
      },

      onError: (error: Error) => {
        /**
         * When checkUserExistsAD returns 404, allow manual sign up
         */
        if (error.message.includes('404')) {
          setShowSignUp(SignUpEnum.REGISTER);
          return;
        }

        setToastState({
          open: true,
          type: ToastStateEnum.ERROR,
          content: 'Connection error, please try again',
        });
      },
    },
  );

  const handleCheckUserExists = async (email: string) => {
    setEmailName({ goback: false, email });
  };

  return (
    <FormProvider {...methods}>
      <StyledForm
        direction="column"
        style={{ width: '100%' }}
        onSubmit={methods.handleSubmit(({ email }) => {
          if (!email) {
            setToastState({
              open: true,
              type: ToastStateEnum.ERROR,
              content: 'Network error, please try again ',
            });
            return;
          }
          handleCheckUserExists(email);
        })}
      >
        <Text css={{ mt: '$24' }} heading="1">
          Sign up
        </Text>
        <Text size="md" color="primary500" css={{ mt: '$8' }}>
          Enter your email address to proceed further
        </Text>

        <Input
          css={{ mt: '$32' }}
          id="email"
          placeholder="Email address"
          state={!valueState ? 'default' : 'error'}
          type="text"
        />

        <Button
          size="lg"
          type="submit"
          css={{
            fontWeight: '$medium',
            fontSize: '$18',
            '& svg': {
              height: '$40 !important',
              width: '$40 !important',
            },
          }}
        >
          Get Started
        </Button>
      </StyledForm>
    </FormProvider>
  );
};

export default SignUpForm;
