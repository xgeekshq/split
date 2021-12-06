export default class LoginUserDto {
  name!: string;

  email!: string;

  accessToken!: { expiresIn: string; token: string };

  refreshToken!: { expiresIn: string; token: string };
}
