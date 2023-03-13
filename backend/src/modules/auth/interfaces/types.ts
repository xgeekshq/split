export const TYPES = {
	services: {
		GetTokenAuthService: 'GetTokenAuthService',
		ValidateAuthService: 'ValidateAuthService',
		RegisterAuthService: 'RegisterAuthService',
		CreateResetTokenAuthService: 'CreateResetTokenAuthService',
		AzureAuthService: 'AzureAuthService',
		UpdateUserService: 'UpdateUserService'
	},
	applications: {
		RegisterUserUseCase: 'RegisterUserUseCase',
		RegisterGuestUserUseCase: 'RegisterGuestUserUseCase',
		StatisticsAuthUserUseCase: 'StatisticsAuthUserUseCase',
		ValidateUserEmailUseCase: 'ValidateUserEmailUseCase',
		SignInUseCase: 'SignInUseCase',
		RefreshTokenUseCase: 'RefreshTokenUseCase',
		ResetPasswordUseCase: 'ResetPasswordUseCase',
		CreateResetTokenUseCase: 'CreateResetTokenUseCase',
		CreateResetTokenAuthApplication: 'CreateResetTokenAuthApplication',
		UpdatePasswordAuthApplication: 'UpdatePasswordAuthApplication',
		UpdateUserApplication: 'UpdateUserApplication'
	},
	repository: {
		ResetPasswordRepository: 'ResetPasswordRepository'
	}
};
