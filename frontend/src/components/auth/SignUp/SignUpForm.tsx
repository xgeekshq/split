import React, { Dispatch, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';

import { styled } from 'styles/stitches/stitches.config';

import { checkUserExists, checkUserExistsAD } from 'api/authService';
import LogoIcon from 'components/icons/Logo';
import Button from 'components/Primitives/Button';
import Flex from 'components/Primitives/Flex';
import Input from 'components/Primitives/Input';
import Text from 'components/Primitives/Text';
import SchemaEmail from 'schema/schemaEmail';
import { toastState } from 'store/toast/atom/toast.atom';
import { EmailUser } from 'types/user/user';
import { NEXT_PUBLIC_ENABLE_AZURE } from 'utils/constants';
import { ToastStateEnum } from 'utils/enums/toast-types';
import isEmpty from 'utils/isEmpty';
import { SignUpEnum } from 'utils/signUp.enum';

const StyledForm = styled('form', Flex, { width: '100%' });

interface SignUpFormProps {
	setShowSignUp: Dispatch<React.SetStateAction<SignUpEnum>>;
	setEmailName: Dispatch<React.SetStateAction<{ email: string; goback: boolean }>>;
	emailName: { email: string; goback: boolean };
}

const SignUpForm: React.FC<SignUpFormProps> = ({ setShowSignUp, setEmailName, emailName }) => {
	const setToastState = useSetRecoilState(toastState);
	const [valueHelperText, setValueHelperText] = useState('');
	const [valueState, setValueState] = useState(false);
	useQuery(
		['checkUserExists', emailName],
		() =>
			NEXT_PUBLIC_ENABLE_AZURE
				? checkUserExistsAD(emailName.email)
				: checkUserExists(emailName.email),
		{
			enabled: !!emailName.email && !emailName.goback,
			suspense: false,
			onSuccess: (data) => {
				if (data === 'az') {
					setShowSignUp(SignUpEnum.SIGN_UP_OPTIONS);
					return;
				}

				if (data === false) {
					setShowSignUp(SignUpEnum.REGISTER);
					return;
				}

				setValueHelperText(' This email already exists');
				setValueState(true);
			},

			onError: (error: Error) => {
				/**
				 * When checkUserExistsAD returns 404, allow manual sign up
				 */
				if (error.message.includes('404')) {
					setShowSignUp(SignUpEnum.REGISTER);
					return;
				}

				setToastState({
					open: true,
					type: ToastStateEnum.ERROR,
					content: 'Connection error, please try again'
				});
			}
		}
	);
	const methods = useForm<EmailUser>({
		mode: 'onSubmit',
		reValidateMode: 'onSubmit',
		defaultValues: {
			email: emailName.email
		},
		resolver: joiResolver(SchemaEmail)
	});

	const handleCheckUserExists = async (email: string) => {
		setEmailName({ goback: false, email });
	};

	return (
		<FormProvider {...methods}>
			<StyledForm
				direction="column"
				style={{ width: '100%' }}
				onSubmit={methods.handleSubmit(({ email }) => {
					if (!email) {
						setToastState({
							open: true,
							type: ToastStateEnum.ERROR,
							content: 'Network error, please try again '
						});
						return;
					}
					handleCheckUserExists(email);
				})}
			>
				<LogoIcon />
				<Text css={{ mt: '$24' }} heading="1">
					Sign up
				</Text>
				<Text size="md" css={{ mt: '$8', color: '$primary500' }}>
					Enter your email address to proceed further
				</Text>
				<Input
					css={{ mt: '$32' }}
					id="email"
					type="text"
					placeholder="Email address"
					helperText={isEmpty(valueHelperText) ? undefined : valueHelperText}
					state={!valueState ? 'default' : 'error'}
				/>

				<Button
					type="submit"
					size="lg"
					css={{
						fontWeight: '$medium',
						fontSize: '$18',
						'& svg': {
							height: '$40 !important',
							width: '$40 !important'
						}
					}}
				>
					Get Started
				</Button>
			</StyledForm>
		</FormProvider>
	);
};

export default SignUpForm;
