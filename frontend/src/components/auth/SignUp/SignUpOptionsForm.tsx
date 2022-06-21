import React, { Dispatch, useState } from 'react';

import { styled } from 'styles/stitches/stitches.config';

import Button from 'components/Primitives/Button';
import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import useUser from 'hooks/useUser';
import { SignUpEnum } from 'utils/signUp.enum';
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
	setEmailName
}) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [loginErrorCode, setLoginErrorCode] = useState(-1);
	const { loginAzure } = useUser(setLoginErrorCode);

	const handleEmailChange = () => {
		setEmailName((prev) => ({ ...prev, goback: true }));
		return setShowSignUp(SignUpEnum.SIGN_UP);
	};

	return (
		<Container direction="column">
			<Text size="md">
				The email
				<Text size="md" fontWeight="medium">
					{emailName}
				</Text>
				supports login with company SSO (Single Sign-on)
			</Text>
			<Button
				type="submit"
				size="lg"
				css={{
					mt: '$32',
					fontWeight: '$medium',
					fontSize: '$18',
					'& svg': {
						height: '$40 !important',
						width: '$40 !important'
					}
				}}
				onClick={loginAzure}
			>
				Log in with SSO
			</Button>
			<OrSeparator css={{ mt: '$22', mb: '$22' }}>
				<hr />
				<Text size="sm" color="primary300" weight="medium">
					or
				</Text>
				<hr />
			</OrSeparator>
			<Text
				size="sm"
				fontWeight="medium"
				underline="true"
				css={{
					alignSelf: 'center',
					'&:hover': {
						textDecorationLine: 'underline',
						cursor: 'pointer'
					}
				}}
				onClick={handleEmailChange}
			>
				Change email
			</Text>
		</Container>
	);
};

export default SignUpOptionsForm;
