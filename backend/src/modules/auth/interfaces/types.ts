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
		GetTokenAuthApplication: 'GetTokenAuthApplication',
		RegisterUserUseCase: 'RegisterUserUseCase',
		RegisterGuestUserUseCase: 'RegisterGuestUserUseCase',
		StatisticsAuthUserUseCase: 'StatisticsAuthUserUseCase',
		ValidateUserEmailUseCase: 'ValidateUserEmailUseCase',
		SignInUseCase: 'SignInUseCase',
		CreateResetTokenAuthApplication: 'CreateResetTokenAuthApplication',
		UpdatePasswordAuthApplication: 'UpdatePasswordAuthApplication',
		UpdateUserApplication: 'UpdateUserApplication'
	},
	repository: {
		ResetPasswordRepository: 'ResetPasswordRepository'
	}
};
