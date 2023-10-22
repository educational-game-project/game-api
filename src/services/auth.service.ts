import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, {
  Model,
  PipelineStage,
  Types,
  isValidObjectId,
} from 'mongoose';
import { CreateAuthDto, UpdateAuthDto } from '@app/common/dto/auth.dto';
import { Users } from '@app/common/model/schema/users.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {}

  private readonly logger = new Logger(AuthService.name);

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
