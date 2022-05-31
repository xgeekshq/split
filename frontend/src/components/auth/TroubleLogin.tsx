import { Dispatch, SetStateAction } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { styled } from 'styles/stitches/stitches.config';

import Icon from 'components/icons/Icon';
import LogoIcon from 'components/icons/Logo';
import Button from 'components/Primitives/Button';
import Flex from 'components/Primitives/Flex';
import Input from 'components/Primitives/Input';
import Text from 'components/Primitives/Text';
import SchemaEmail from 'schema/schemaEmail';
import { EmailUser } from 'types/user/user';

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
	const methods = useForm<EmailUser>({
		mode: 'onChange',
		reValidateMode: 'onChange',
		defaultValues: {
			email: ''
		},
		resolver: zodResolver(SchemaEmail)
	});

	const handleShowTrubleLogginIn = () => {
		setShowTroubleLogin(false);
	};

	const handleRecoverPassword = (email: string) => {
		console.log(email);
	};

	return (
		<MainContainer
			direction="column"
			onSubmit={methods.handleSubmit(({ email }) => {
				handleRecoverPassword(email);
			})}
		>
			<FormProvider {...methods}>
				<LogoIcon />
				<Text css={{ mt: '$24' }} heading="1">
					Trouble logging in?
				</Text>
				<Text size="md" css={{ mt: '$8', color: '$primary500' }}>
					Enter your email address below, well email you instructions on how to change
					your password.
				</Text>
				<Input css={{ mt: '$32' }} id="email" type="text" placeholder="Email address" />
				<Button
					size="lg"
					css={{
						fontWeight: '$medium',
						fontSize: '$18'
					}}
				>
					Recover password
				</Button>
				<GoBackWrapper gap="8" align="center" onClick={handleShowTrubleLogginIn}>
					<Icon css={{ width: '$16', height: '$16' }} name="arrow-long-left" />
					<Text>Go back</Text>
				</GoBackWrapper>
			</FormProvider>
		</MainContainer>
	);
};

export default TroubleLogin;
