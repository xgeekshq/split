import React, { Dispatch } from 'react';

import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import { SignUpEnum } from '@/enums/auth/signUp';
import loginWithAzure from '@/hooks/auth/loginWithAzure';
import { styled } from '@/styles/stitches/stitches.config';

const Container = styled(Flex, { width: '100%' });

interface SignUpOptionsFormProps {
  setShowSignUp: Dispatch<React.SetStateAction<SignUpEnum>>;
  emailName: string;
  setEmailName: Dispatch<React.SetStateAction<{ email: string; goback: boolean }>>;
}

const SignUpOptionsForm: React.FC<SignUpOptionsFormProps> = ({
  setShowSignUp,
  emailName,
  setEmailName,
}) => {
  const handleEmailChange = () => {
    setEmailName((prev) => ({ ...prev, goback: true }));
    return setShowSignUp(SignUpEnum.SIGN_UP);
  };

  return (
    <Container direction="column">
      <Text size="md">
        The email&nbsp;
        <Text fontWeight="medium" size="md">
          {emailName}
        </Text>
        &nbsp;supports login with company SSO (Single Sign-on)
      </Text>
      <Button
        onClick={loginWithAzure}
        size="lg"
        type="submit"
        css={{
          mt: '$32',
        }}
      >
        Log in with SSO
      </Button>
      <Flex align="center" css={{ width: '100%', my: '$26' }} gap="16">
        <Separator />
        <Text color="primary300" fontWeight="medium" size="sm">
          OR
        </Text>
        <Separator />
      </Flex>
      <Text
        fontWeight="medium"
        onClick={handleEmailChange}
        size="sm"
        underline="true"
        css={{
          alignSelf: 'center',
          '&:hover': {
            textDecorationLine: 'underline',
            cursor: 'pointer',
          },
        }}
      >
        Change email
      </Text>
    </Container>
  );
};

export default SignUpOptionsForm;
