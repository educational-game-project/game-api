import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, {
  Model,
  PipelineStage,
  Types,
  isValidObjectId,
} from 'mongoose';
import { LoginUserDto } from '@app/common/dto/auth.dto';
import { Users } from '@app/common/model/schema/users.schema';
import { ResponseService } from '@app/common/response/response.service';
import { StringHelper } from '@app/common/helpers/string.helpers';
import { UserRole } from '@app/common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  private readonly logger = new Logger(AuthService.name);

  public async login(body: LoginUserDto): Promise<any> {
    try {
      let user = await this.usersModel.findOne({ name: body.name, role: UserRole.USER });
      if (!user) return this.responseService.error(HttpStatus.NOT_FOUND, StringHelper.notFoundResponse('user'));




    } catch (error) {
      this.logger.error(this.login.name);
      console.log(error)
      this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: '', property: '' })
    }
  }
}
