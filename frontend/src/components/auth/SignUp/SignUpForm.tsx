import React, { Dispatch } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { checkUserExists, checkUserExistsAD } from '@/api/authService';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Input from '@/components/Primitives/Inputs/Input/Input';
import Text from '@/components/Primitives/Text/Text';
import SchemaEmail from '@/schema/schemaEmail';
import { toastState } from '@/store/toast/atom/toast.atom';
import { FlexForm } from '@/styles/pages/pages.styles';
import { EmailUser } from '@/types/user/user';
import { NEXT_PUBLIC_ENABLE_AZURE } from '@/utils/constants';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { SignUpEnum } from '@/utils/signUp.enum';

interface SignUpFormProps {
  setShowSignUp: Dispatch<React.SetStateAction<SignUpEnum>>;
  setEmailName: Dispatch<React.SetStateAction<{ email: string; goback: boolean }>>;
  emailName: { email: string; goback: boolean };
}

const SignUpForm = ({ setShowSignUp, setEmailName, emailName }: SignUpFormProps) => {
  const setToastState = useSetRecoilState(toastState);
  const methods = useForm<EmailUser>({
    mode: 'onChange',
    reValidateMode: 'onChange',
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
      <FlexForm
        direction="column"
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
        <Text color="primary500" css={{ mt: '$8' }} size="md">
          Enter your email address to proceed further
        </Text>

        <Input css={{ mt: '$32' }} id="email" placeholder="Email address" type="text" />

        <Button size="lg" type="submit">
          Get Started
        </Button>
      </FlexForm>
    </FormProvider>
  );
};

export default SignUpForm;
