import { Dispatch, SetStateAction, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';

import EmailSent from '@/components/auth/ForgotPassword/EmailSent';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Input from '@/components/Primitives/Inputs/Input/Input';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import useResetToken from '@/hooks/auth/useResetToken';
import SchemaEmail from '@/schema/schemaEmail';
import { FlexForm } from '@/styles/pages/pages.styles';
import { EmailUser } from '@/types/user/user';

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
        goBack={handleShowTroubleLogginIn}
        userEmail={currentEmail}
        resendEmail={() => {
          handleRecoverPassword(currentEmail);
        }}
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
        <Text color="primary500" css={{ mt: '$8' }} size="md">
          Enter your email address below, well email you instructions on how to change your
          password.
        </Text>
        <Input css={{ mt: '$32' }} id="email" placeholder="Email address" type="text" />
        <Button size="lg" type="submit">
          Recover password
        </Button>
        <Flex>
          <Button
            css={{ pl: '0', mt: '$24', color: '$primary500' }}
            onClick={handleShowTroubleLogginIn}
            variant="link"
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
