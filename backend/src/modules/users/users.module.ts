import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import User, { UserSchema } from './schemas/user.schema';
import {
  createUserService,
  getUserService,
  updateUserService,
} from './users.providers';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [createUserService, getUserService, updateUserService],
  exports: [createUserService, getUserService, updateUserService],
})
export default class UsersModule {}
