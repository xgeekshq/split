import { Module } from '@nestjs/common';
import { mongooseUserModule } from 'src/infrastructure/database/mongoose.module';
import TeamsModule from '../teams/teams.module';
import {
  createUserService,
  getUserService,
  updateUserService,
  getUserApplication,
} from './users.providers';

@Module({
  imports: [mongooseUserModule, TeamsModule],
  providers: [
    createUserService,
    getUserService,
    updateUserService,
    getUserApplication,
  ],
  exports: [
    createUserService,
    getUserService,
    updateUserService,
    getUserApplication,
  ],
})
export default class UsersModule {}
