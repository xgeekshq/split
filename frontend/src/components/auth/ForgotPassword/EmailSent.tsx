import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import Icon from '@/components/Primitives/Icons/Icon/Icon';

interface EmailSentProps {
  userEmail: string;
  resendEmail: () => void;
  goBack: () => void;
}

const EmailSent = ({ userEmail, resendEmail, goBack }: EmailSentProps) => (
  <Flex direction="column">
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
    <Button size="lg" type="button" onClick={resendEmail}>
      Resend email with reset link
    </Button>
    <Flex>
      <Button variant="link" css={{ pl: '0', mt: '$24', color: '$primary500' }} onClick={goBack}>
        <Icon name="arrow-long-left" />
        Go Back
      </Button>
    </Flex>
  </Flex>
);

export default EmailSent;
