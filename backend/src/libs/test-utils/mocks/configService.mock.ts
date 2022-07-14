const configService = {
	get(key: string) {
		switch (key) {
			case 'JWT_ACCESS_TOKEN_EXPIRATION_TIME':
				return '3600';
			default:
				return 'UNKNOWN';
		}
	}
};

export default configService;
