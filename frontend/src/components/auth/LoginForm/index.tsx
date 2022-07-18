import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import router from 'next/router';
import { RedirectableProviderType } from 'next-auth/providers';
import { signIn } from 'next-auth/react';
import { useSetRecoilState } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';

import Icon from 'components/icons/Icon';
import LogoIcon from 'components/icons/Logo';
import { DotsLoading } from 'components/loadings/DotsLoading';
import Flex from 'components/Primitives/Flex';
import Input from 'components/Primitives/Input';
import { TabsContent } from 'components/Primitives/Tab';
import Text from 'components/Primitives/Text';
import { getAuthError } from 'errors/auth-messages';
import useUser from 'hooks/useUser';
import SchemaLoginForm from 'schema/schemaLoginForm';
import { toastState } from 'store/toast/atom/toast.atom';
import { LoginUser } from 'types/user/user';
import {
	AUTH_SSO,
	NEXT_PUBLIC_ENABLE_AZURE,
	NEXT_PUBLIC_ENABLE_GIT,
	NEXT_PUBLIC_ENABLE_GOOGLE
} from 'utils/constants';
import { ToastStateEnum } from 'utils/enums/toast-types';
import { transformLoginErrorCodes } from 'utils/errorCodes';
import { DASHBOARD_ROUTE } from 'utils/routes';
import { LoginButton, OrSeparator, StyledForm, StyledHoverIconFlex } from './styles';

interface LoginFormProps {
	setShowTroubleLogin: Dispatch<SetStateAction<boolean>>;
}

const LoginForm: React.FC<LoginFormProps> = ({ setShowTroubleLogin }) => {
	const [loading, setLoading] = useState({ credentials: false, sso: false });
	const setToastState = useSetRecoilState(toastState);
	const [loginErrorCode, setLoginErrorCode] = useState(-1);
	const { loginAzure } = useUser();
	const methods = useForm<LoginUser>({
		mode: 'onBlur',
		reValidateMode: 'onBlur',
		defaultValues: {
			email: '',
			password: ''
		},
		resolver: joiResolver(SchemaLoginForm)
	});

	const clearErrors = () => {
		setToastState((prev) => ({ ...prev, open: false }));
		setLoading({ credentials: false, sso: false });
		setLoginErrorCode(-1);
	};

	const handleLoginAzure = () => {
		if (loading.sso) return;
		setLoading((prevState) => ({ ...prevState, sso: true }));
		loginAzure();
	};

	/**
	 * Show error toast when change loginErrorCode
	 * If this error is different of -1
	 */
	useEffect(() => {
		if (loginErrorCode !== -1) {
			setToastState({
				open: true,
				type: ToastStateEnum.ERROR,
				content: getAuthError(loginErrorCode)
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loginErrorCode]);

	const handleLogin = async (credentials: LoginUser) => {
		setLoading((prevState) => ({ ...prevState, credentials: true }));
		const result = await signIn<RedirectableProviderType>('credentials', {
			...credentials,
			callbackUrl: DASHBOARD_ROUTE,
			redirect: false
		});
		if (!result?.error) {
			setToastState((prev) => ({ ...prev, open: false }));
			router.push(DASHBOARD_ROUTE);
			return;
		}
		setLoginErrorCode(transformLoginErrorCodes(result.error));

		setLoading((prevState) => ({ ...prevState, credentials: false }));
	};

	const handleShowTroubleLogginIn = () => {
		setShowTroubleLogin(true);
	};

	return (
		<TabsContent value="login" css={{ justifyContent: 'center' }}>
			<FormProvider {...methods}>
				<StyledForm
					autoComplete="off"
					direction="column"
					style={{ width: '100%' }}
					onSubmit={methods.handleSubmit((credentials: LoginUser) => {
						handleLogin(credentials);
					})}
				>
					<LogoIcon />
					<Text css={{ mt: '$24' }} heading="1">
						Log In
					</Text>
					<Text size="md" css={{ mt: '$8', color: '$primary500' }}>
						Enter your email and password to log in.
					</Text>
					<Input
						clearErrorCode={clearErrors}
						state={loginErrorCode > 0 ? 'error' : undefined}
						css={{ mt: '$32' }}
						id="email"
						type="text"
						placeholder="Email address"
						forceState={loginErrorCode > 0}
					/>
					<Input
						clearErrorCode={clearErrors}
						state={loginErrorCode > 0 ? 'error' : undefined}
						id="password"
						type="password"
						placeholder="Password"
						icon="eye"
						iconPosition="right"
						forceState={loginErrorCode > 0}
					/>

					<LoginButton type="submit" disabled={loading.credentials} size="lg">
						{loading.credentials && <DotsLoading color="primary800" size={10} />}
						{!loading.credentials && 'Log in'}
					</LoginButton>
					<Text
						size="sm"
						css={{
							alignSelf: 'center',
							mt: '$16',
							'&:hover': {
								textDecorationLine: 'underline',
								cursor: 'pointer'
							}
						}}
						onClick={handleShowTroubleLogginIn}
						data-testid="forgot-password-button"
					>
						Forgot password
					</Text>
					{AUTH_SSO && (
						<Flex justify="center" align="center" direction="column">
							<OrSeparator>
								<hr />
								<Text size="sm" color="primary300" weight="medium">
									or
								</Text>
								<hr />
							</OrSeparator>
							<Flex gap="32">
								{NEXT_PUBLIC_ENABLE_GIT && (
									<StyledHoverIconFlex>
										<Icon css={{ width: '$60', height: '$60' }} name="github" />
									</StyledHoverIconFlex>
								)}
								{NEXT_PUBLIC_ENABLE_GOOGLE && (
									<StyledHoverIconFlex>
										<Icon css={{ width: '$60', height: '$60' }} name="google" />
									</StyledHoverIconFlex>
								)}
								{NEXT_PUBLIC_ENABLE_AZURE && (
									<StyledHoverIconFlex
										data-loading={loading.sso}
										onClick={handleLoginAzure}
									>
										<Icon
											css={{ width: '$60', height: '$60' }}
											name="microsoft"
										/>
									</StyledHoverIconFlex>
								)}
							</Flex>
						</Flex>
					)}
				</StyledForm>
			</FormProvider>
		</TabsContent>
	);
};

export default LoginForm;
