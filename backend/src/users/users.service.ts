import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException('EMAIL_NOT_EXISTS', HttpStatus.NOT_FOUND);
  }

  async create(userData: CreateUserDto) {
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  async delete(email: string) {
    await this.usersRepository.delete(await this.getByEmail(email));
  }
}
