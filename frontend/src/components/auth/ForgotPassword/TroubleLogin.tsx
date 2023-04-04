import { Dispatch, SetStateAction, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';

import { styled } from '@/styles/stitches/stitches.config';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Input from '@/components/Primitives/Inputs/Input/Input';
import Text from '@/components/Primitives/Text/Text';
import SchemaEmail from '@/schema/schemaEmail';
import { EmailUser } from '@/types/user/user';

import useResetToken from '@/hooks/auth/useResetToken';
import EmailSent from '@/components/auth/ForgotPassword/EmailSent';

const MainContainer = styled('form', Flex, {
  width: '100%',
});

interface TroubleLoginProps {
  setShowTroubleLogin: Dispatch<SetStateAction<boolean>>;
}

const TroubleLogin: React.FC<TroubleLoginProps> = ({ setShowTroubleLogin }) => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [showEmailSent, setShowEmailSent] = useState(false);
  const methods = useForm<EmailUser>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
    },
    resolver: joiResolver(SchemaEmail),
  });

  const { mutateAsync } = useResetToken();

  const handleShowTroubleLogginIn = () => {
    setShowTroubleLogin(false);
  };

  const handleRecoverPassword = async (email: string) => {
    await mutateAsync({ email });

    setShowEmailSent(true);
    setCurrentEmail(email);
  };
  if (showEmailSent) return <EmailSent userEmail={currentEmail} />;
  return (
    <MainContainer
      direction="column"
      onSubmit={methods.handleSubmit(({ email }) => {
        handleRecoverPassword(email);
      })}
    >
      <FormProvider {...methods}>
        <Icon name="logo" />
        <Text css={{ mt: '$24' }} heading="1">
          Trouble logging in?
        </Text>
        <Text size="md" color="primary500" css={{ mt: '$8' }}>
          Enter your email address below, well email you instructions on how to change your
          password.
        </Text>
        <Input css={{ mt: '$32' }} id="email" placeholder="Email address" type="text" />
        <Button size="lg" type="submit">
          Recover password
        </Button>
        <Flex>
          <Button
            variant="link"
            css={{ pl: '0', mt: '$24', color: '$primary500' }}
            onClick={handleShowTroubleLogginIn}
          >
            <Icon name="arrow-long-left" />
            Go Back
          </Button>
        </Flex>
      </FormProvider>
    </MainContainer>
  );
};

export default TroubleLogin;
