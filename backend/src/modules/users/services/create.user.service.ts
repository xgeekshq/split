import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CreateUserDto from '../dto/createUser.dto';
import { CreateUserService } from '../interfaces/services/create.user.service.interface';
import User, { UserDocument } from '../schemas/user.schema';

@Injectable()
export default class CreateUserServiceImpl implements CreateUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(userData: CreateUserDto) {
    return this.userModel.create(userData);
  }
}
