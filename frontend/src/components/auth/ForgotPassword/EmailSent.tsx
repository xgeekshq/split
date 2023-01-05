import { FC, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { styled } from '@/styles/stitches/stitches.config';

import Icon from '@/components/icons/Icon';
import Button from '@/components/Primitives/Button';
import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import useUser from '@/hooks/useUser';
import { toastState } from '@/store/toast/atom/toast.atom';
import { ToastStateEnum } from '@/utils/enums/toast-types';

const MainContainer = styled('form', Flex, {
  width: '100%',
});

interface EmailSentProps {
  userEmail: string;
}

const EmailSent: FC<EmailSentProps> = ({ userEmail }) => {
  const { resetToken } = useUser();
  const [currentEmail, setCurrentEmail] = useState('');
  const [showEmailSent, setShowEmailSent] = useState(false);
  const setToastState = useSetRecoilState(toastState);
  const handleRecoverPassword = async (email: string) => {
    const res = await resetToken.mutateAsync({ email });
    if (res.message === 'EMAIL_SENDED_RECENTLY') {
      setToastState({
        open: true,
        type: ToastStateEnum.INFO,
        content: 'Email was sent recently please wait 1 minute and try again',
      });
    }
    if (res.message === 'please check your email') {
      setToastState({
        open: true,
        type: ToastStateEnum.INFO,
        content: 'Another link was sent to your email',
      });
    }
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
        css={{
          mt: '$16',
          color: '$primary500',
          margin: '8px auto 32px 0',
        }}
      >
        A link to reset your password has been sent to{' '}
        <Text css={{ mt: '$16', color: '$primary500', fontWeight: '500' }} size="md">
          {userEmail}
          <Text
            size="md"
            css={{
              mt: '$16',
              color: '$primary500',
              margin: '8px auto 32px 0',
              letterSpacing: '-1px',
            }}
          >
            . Please allow a few minutes for the email to get to you and then follow the
            instructions in the email.
          </Text>
        </Text>
      </Text>

      <Separator />
      <Text
        size="md"
        css={{
          mt: '$16',
          color: '$primary300',
          letterSpacing: '-1px',
          margin: '24px auto 24px',
        }}
      >
        If you dont see the email, check other places it might be, like your junk, spam, social, or
        other folders.
      </Text>
      <Button
        size="lg"
        type="button"
        css={{
          fontWeight: '$medium',
          fontSize: '$18',
        }}
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
