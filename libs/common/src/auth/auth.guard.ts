import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard as Guard, IAuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Users } from '../model/schema/users.schema';

@Injectable()
export class JwtAuthGuard extends Guard('jwt') implements IAuthGuard {
  public handleRequest(err: unknown, user: Users): any {
    return user;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const user: Request = context.switchToHttp().getRequest();

    return user ? true : false;
  }
}