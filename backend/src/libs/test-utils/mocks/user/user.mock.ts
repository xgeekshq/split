import { LeanDocument } from 'mongoose';
import CreateUserDto from '../../../../modules/users/dto/create.user.dto';
import { UserDocument } from '../../../../modules/users/schemas/user.schema';

const mockedUser: CreateUserDto = {
  firstName: 'test',
  lastName: 'test',
  email: 'teste@test.com',
  password: 'tesT12!3',
};

export const mockLeanUser = (user: LeanDocument<UserDocument>) => {
  const userLeaned = { ...user };
  delete (userLeaned as any).password;
  return userLeaned;
};

export const userId = '620d40a80fbc922eb1dea392';

export const mockedResponseWithRefreshToken = {
  value: {
    ...mockedUser,
  },
  lastErrorObject: {
    updatedExisting: true,
  },
};

export const mockedBearerToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWZkYjE2ODQ5OTZhMjdmOTAwODdhNjAiLCJpYXQiOjE2NDQwMjUxNTEsImV4cCI6MTY0NDExMTU1MX0.Ba_ImsOD83K1weZVliG7AAHQmtnLp9BXvVbSNOzOinM';

export default mockedUser;
