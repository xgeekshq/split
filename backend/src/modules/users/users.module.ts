import { Module } from '@nestjs/common';
import { mongooseUserModule } from 'src/infrastructure/database/mongoose.module';
import {
  createUserService,
  getUserService,
  updateUserService,
} from './users.providers';

@Module({
  imports: [mongooseUserModule],
  providers: [createUserService, getUserService, updateUserService],
  exports: [createUserService, getUserService, updateUserService],
})
export default class UsersModule {}
