import { useState } from 'react';

import { styled } from '@/styles/stitches/stitches.config';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import useResetToken from '@/hooks/users/useResetToken';

const MainContainer = styled('form', Flex, {
  width: '100%',
});

interface EmailSentProps {
  userEmail: string;
}

const EmailSent = ({ userEmail }: EmailSentProps) => {
  const { mutateAsync } = useResetToken();

  const [currentEmail, setCurrentEmail] = useState('');
  const [showEmailSent, setShowEmailSent] = useState(false);

  const handleRecoverPassword = async (email: string) => {
    await mutateAsync({ email });

    setShowEmailSent(true);
    setCurrentEmail(userEmail);
  };

  if (showEmailSent) return <EmailSent userEmail={currentEmail} />;

  return (
    <MainContainer direction="column">
      <Icon css={{ width: '54.74px', height: '52px' }} name="envelope" />
      <Text css={{ mt: '$24' }} heading="1">
        Check Your email
      </Text>
      <Text
        size="md"
        color="primary500"
        css={{
          margin: '12px auto 32px 0',
        }}
      >
        A link to reset your password has been sent to{' '}
        <Text size="md" fontWeight="bold" color="primary500">
          {userEmail}
        </Text>
        . Please allow a few minutes for the email to get to you and then follow the instructions in
        the email.
      </Text>

      <Separator />
      <Text
        label
        css={{
          margin: '24px auto',
        }}
      >
        If you dont see the email, check other places it might be, like your junk, spam, social, or
        other folders.
      </Text>
      <Button
        size="lg"
        type="button"
        onClick={() => {
          handleRecoverPassword(userEmail);
        }}
      >
        Resend email with reset link
      </Button>
    </MainContainer>
  );
};

export default EmailSent;
