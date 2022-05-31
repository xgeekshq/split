import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import router from 'next/router';
import { RedirectableProviderType } from 'next-auth/providers';
import { signIn } from 'next-auth/react';
import React, { Dispatch, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

import { registerNewUser } from '../../../api/authService';
import SchemaRegisterForm from '../../../schema/schemaRegisterForm';
import { styled } from '../../../stitches.config';
import { toastState } from '../../../store/toast/atom/toast.atom';
import { RegisterUser, User } from '../../../types/user/user';
import { ToastStateEnum } from '../../../utils/enums/toast-types';
import isEmpty from '../../../utils/isEmpty';
import { DASHBOARD_ROUTE } from '../../../utils/routes';
import { SignUpEnum } from '../../../utils/signUp.enum';
import Icon from '../../icons/Icon';
import LogoIcon from '../../icons/Logo';
import Button from '../../Primitives/Button';
import Flex from '../../Primitives/Flex';
import Input from '../../Primitives/Input';
import Text from '../../Primitives/Text';

const StyledForm = styled('form', Flex, { width: '100%' });
const msgHelpertext =
	'Use at least 8 characters, upper and lower case letters, numbers and symbols like !”?$%^&).';

const GoBackWrapper = styled(Flex, {
	mt: '$24',
	textAlign: 'center',
	'&:hover': {
		textDecorationLine: 'underline',
		cursor: 'pointer'
	}
});

interface RegisterFormProps {
	emailName: { email: string; goback: boolean };
	setShowSignUp: Dispatch<React.SetStateAction<SignUpEnum>>;
	setCurrentTab: Dispatch<React.SetStateAction<string>>;
	setEmailName: Dispatch<React.SetStateAction<{ email: string; goback: boolean }>>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ setShowSignUp, emailName, setEmailName }) => {
	const [valueHelperText, setValueHelperText] = useState(msgHelpertext);
	const setToastState = useSetRecoilState(toastState);
	const methods = useForm<RegisterUser>({
		mode: 'onBlur',
		reValidateMode: 'onChange',
		defaultValues: {
			email: '',
			firstName: '',
			lastName: '',
			password: ''
		},
		resolver: zodResolver(SchemaRegisterForm)
	});
	// console.log("methods password field",methods.getFieldState('password'));
	// console.log(methods.formState.errors.password);
	if (methods.formState.errors.password === undefined) {
		setValueHelperText('');
	}
	// console.log('methods=', methods);
	// console.log("watch=",watch(['firstName']));
	// setValueHelperText('');
	//  despair();

	const clearErrors = () => {
		setToastState((prev) => ({ ...prev, open: false }));
	};

	const handleShowSignUp = () => {
		setEmailName((prev) => ({ ...prev, goback: true }));
		clearErrors();
		setShowSignUp(SignUpEnum.SIGN_UP);
	};
	const handleLogin = async () => {
		const result = await signIn<RedirectableProviderType>('credentials', {
			...methods.getValues(),
			callbackUrl: DASHBOARD_ROUTE,
			redirect: false
		});
		if (!result?.error) {
			console.log('passou');
			// setToastState((prev) => ({ ...prev, open: false }));
			router.push(DASHBOARD_ROUTE);
			return;
		}

		console.log('deu erro');
	};

	const createUser = useMutation<User, AxiosError, RegisterUser, unknown>(
		(user: RegisterUser) => registerNewUser(user),
		{
			mutationKey: 'register',
			onError: () => {
				setToastState({
					open: true,
					type: ToastStateEnum.ERROR,
					content: 'Something went wrong, please try again'
				});
			},
			onSuccess: () => {
				handleLogin();
			}
		}
	);

	const handleRegister = async (user: RegisterUser) => {
		user.email = user.email.toLowerCase();
		createUser.mutate(user);
	};

	methods.setValue('email', emailName.email);
	return (
		<FormProvider {...methods}>
			<StyledForm
				direction="column"
				style={{ width: '100%' }}
				onSubmit={methods.handleSubmit((credentials: RegisterUser) => {
					handleRegister(credentials);
				})}
			>
				<LogoIcon />
				<Text css={{ mt: '$24' }} heading="1">
					Sign up
				</Text>
				<Text size="md" css={{ mt: '$8', mb: '$16', color: '$primary500' }}>
					Put in your credentials or ask your admin to add your email to the companys’
					azure database.
				</Text>
				<Input
					disabled
					type="text"
					id="email"
					placeholder="Email address"
					state="default"
				/>
				<Flex direction="row" gap="16">
					<Input id="firstName" type="text" placeholder="First Name" />
					<Input id="lastName" type="text" placeholder="Last Name" />
				</Flex>
				<Input
					id="password"
					placeholder="Password"
					type="password"
					icon="eye"
					iconPosition="right"
					helperText={isEmpty(valueHelperText) ? undefined : valueHelperText}
				/>
				<Input
					id="passwordConf"
					placeholder="Confirm Password"
					type="password"
					icon="eye"
					iconPosition="right"
				/>
				<Button
					type="submit"
					size="lg"
					css={{
						mt: '$24',
						fontWeight: '$medium',
						fontSize: '$18',
						'& svg': {
							height: '$40 !important',
							width: '$40 !important'
						}
					}}
				>
					Sign up
				</Button>
				<GoBackWrapper gap="8" align="center" onClick={handleShowSignUp}>
					<Icon css={{ width: '$20', height: '$20' }} name="arrow-long-left" />
					<Text>Go back</Text>
				</GoBackWrapper>
			</StyledForm>
		</FormProvider>
	);
};

export default RegisterForm;
