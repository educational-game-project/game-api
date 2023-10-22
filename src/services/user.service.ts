import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage, Types, isValidObjectId } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from '@app/common/dto/user.dto';
import { Users } from '@app/common/model/schema/users.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
  ) { }

  private readonly logger = new Logger(UserService.name)

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
