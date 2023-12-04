import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
} from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

// This interceptor for restructure response success
@Injectable()
export class ResponseInterceptor
  implements NestInterceptor<Promise<any> | string>
{
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<any> | string>> {
    const ctx: HttpArgumentsHost = context.switchToHttp();
    const requesteExpress: any = ctx.getRequest();
    const responseExpress: any = ctx.getResponse();

    return next.handle().pipe(
      map(async (response: Promise<Record<string, any> | string>) => {
        const status: number = responseExpress.statusCode;
        const data: Record<string, any> | string = await response;

        // response error must in object
        if (typeof data !== "object") {
          throw new InternalServerErrorException("Data not object");
        }

        const { statusCode, ...others } = data;
        return {
          status_code: statusCode || status,
          ...others,
        };
      }),
    );
  }
}
