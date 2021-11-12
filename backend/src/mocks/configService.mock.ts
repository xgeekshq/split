const configService = {
  get(key: string) {
    switch (key) {
      case 'JWT_ACCESS_TOKEN_EXPIRATION_TIME':
        return '3600';
    }
  },
};

export default configService;
