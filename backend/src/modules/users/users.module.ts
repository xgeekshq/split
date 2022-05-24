import { Module } from '@nestjs/common';
import {
  mongooseResetModule,
  mongooseUserModule,
} from 'src/infrastructure/database/mongoose.module';
import TeamsModule from '../teams/teams.module';
import {
  createUserService,
  getUserService,
  updateUserService,
  getUserApplication,
  updateUserApplication,
} from './users.providers';

@Module({
  imports: [mongooseUserModule, mongooseResetModule, TeamsModule],
  providers: [
    createUserService,
    getUserService,
    updateUserService,
    getUserApplication,
    updateUserApplication,
  ],
  exports: [
    createUserService,
    getUserService,
    updateUserService,
    getUserApplication,
  ],
})
export default class UsersModule {}
