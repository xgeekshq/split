import { Dispatch, SetStateAction, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';

import { styled } from '@/styles/stitches/stitches.config';

import Icon from '@/components/Primitives/Icon';
import Button from '@/components/Primitives/Button';
import Flex from '@/components/Primitives/Flex';
import Input from '@/components/Primitives/Inputs/Input/Input';
import Text from '@/components/Primitives/Text';
import useUser from '@/hooks/useUser';
import SchemaEmail from '@/schema/schemaEmail';
import { toastState } from '@/store/toast/atom/toast.atom';
import { EmailUser } from '@/types/user/user';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import EmailSent from './EmailSent';

const MainContainer = styled('form', Flex, {
  width: '100%',
});

interface TroubleLoginProps {
  setShowTroubleLogin: Dispatch<SetStateAction<boolean>>;
}

const TroubleLogin: React.FC<TroubleLoginProps> = ({ setShowTroubleLogin }) => {
  const setToastState = useSetRecoilState(toastState);
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

  const { resetToken } = useUser();

  const handleShowTroubleLogginIn = () => {
    setShowTroubleLogin(false);
  };

  const handleRecoverPassword = async (email: string) => {
    const res = await resetToken.mutateAsync({ email });
    if (res.message === 'EMAIL_SENDED_RECENTLY') {
      setToastState({
        open: true,
        type: ToastStateEnum.ERROR,
        content: 'Email was sent recently please wait 1 minute and try again',
      });
      return;
    }
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
