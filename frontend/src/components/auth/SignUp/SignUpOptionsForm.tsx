import React, { Dispatch } from 'react';

import { styled } from '@/styles/stitches/stitches.config';

import Button from '@/components/Primitives/Button';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import useUser from '@/hooks/useUser';
import { SignUpEnum } from '@/utils/signUp.enum';
import { OrSeparator } from '../LoginForm/styles';

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
  const { loginAzure } = useUser();

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
        size="lg"
        type="submit"
        css={{
          mt: '$32',
          fontWeight: '$medium',
          fontSize: '$18',
          '& svg': {
            height: '$40 !important',
            width: '$40 !important',
          },
        }}
        onClick={loginAzure}
      >
        Log in with SSO
      </Button>
      <OrSeparator css={{ mt: '$22', mb: '$22' }}>
        <hr />
        <Text color="primary300" size="sm" weight="medium">
          or
        </Text>
        <hr />
      </OrSeparator>
      <Text
        fontWeight="medium"
        size="sm"
        underline="true"
        css={{
          alignSelf: 'center',
          '&:hover': {
            textDecorationLine: 'underline',
            cursor: 'pointer',
          },
        }}
        onClick={handleEmailChange}
      >
        Change email
      </Text>
    </Container>
  );
};

export default SignUpOptionsForm;
