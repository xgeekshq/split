import { Dispatch, SetStateAction, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Input from '@/components/Primitives/Inputs/Input/Input';
import Text from '@/components/Primitives/Text/Text';
import SchemaEmail from '@/schema/schemaEmail';
import { EmailUser } from '@/types/user/user';

import useResetToken from '@/hooks/auth/useResetToken';
import EmailSent from '@/components/auth/ForgotPassword/EmailSent';
import { FlexForm } from '@/styles/pages/pages.styles';

interface TroubleLoginProps {
  setShowTroubleLogin: Dispatch<SetStateAction<boolean>>;
}

const TroubleLogin = ({ setShowTroubleLogin }: TroubleLoginProps) => {
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

  const { mutate } = useResetToken();

  const handleShowTroubleLogginIn = () => {
    setShowTroubleLogin(false);
  };

  const handleRecoverPassword = (email: string) => {
    mutate(
      { email },
      {
        onSuccess: () => {
          setShowEmailSent(true);
          setCurrentEmail(email);
        },
      },
    );
  };

  if (showEmailSent)
    return (
      <EmailSent
        userEmail={currentEmail}
        resendEmail={() => {
          handleRecoverPassword(currentEmail);
        }}
        goBack={handleShowTroubleLogginIn}
      />
    );

  return (
    <FlexForm
      direction="column"
      onSubmit={methods.handleSubmit(({ email }) => {
        handleRecoverPassword(email);
      })}
    >
      <FormProvider {...methods}>
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
    </FlexForm>
  );
};

export default TroubleLogin;
