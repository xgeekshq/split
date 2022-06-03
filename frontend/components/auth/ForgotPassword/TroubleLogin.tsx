import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';

import useUser from '../../../hooks/useUser';
import SchemaEmail from '../../../schema/schemaEmail';
import { styled } from '../../../stitches.config';
import { toastState } from '../../../store/toast/atom/toast.atom';
import { EmailUser } from '../../../types/user/user';
import { ToastStateEnum } from '../../../utils/enums/toast-types';
import Icon from '../../icons/Icon';
import Button from '../../Primitives/Button';
import Flex from '../../Primitives/Flex';
import Input from '../../Primitives/Input';
import Text from '../../Primitives/Text';
import EmailSent from './EmailSent';

const MainContainer = styled('form', Flex, {
	width: '$500',
	backgroundColor: '$white',
	boxShadow: '0px 4px 54px rgba(0, 0, 0, 0.5)',
	borderRadius: '$12',
	py: '$48',
	px: '$32'
});

const GoBackWrapper = styled(Flex, {
	mt: '$24',
	textAlign: 'center',
	'&:hover': {
		textDecorationLine: 'underline',
		cursor: 'pointer'
	}
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
			email: ''
		},
		resolver: zodResolver(SchemaEmail)
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
				content: 'Email was sent recently please wait 1 minute and try again'
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
				<Text size="md" css={{ mt: '$8', color: '$primary500' }}>
					Enter your email address below, well email you instructions on how to change
					your password.
				</Text>
				<Input css={{ mt: '$32' }} id="email" type="text" placeholder="Email address" />
				<Button
					type="submit"
					size="lg"
					css={{
						fontWeight: '$medium',
						fontSize: '$18'
					}}
				>
					Recover password
				</Button>
				<GoBackWrapper gap="8" align="center" onClick={handleShowTroubleLogginIn}>
					<Icon name="arrow-left" />
					<Text>Go back</Text>
				</GoBackWrapper>
			</FormProvider>
		</MainContainer>
	);
};

export default TroubleLogin;
