import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

// Restructure Response Object For Guard Exception
@Catch()
export class ResponseFilter implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: any = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status: number = exception.getStatus();
      const exceptionHttp: Record<string, any> = exception;
      const exceptionData: Record<string, any> = exceptionHttp.response;
      const mess = (status == 429)?"too_many_request":exceptionData.message;

      response.status(status).json({
        statusCode: status,
        status:'error',
        server_time: new Date().toISOString(),
        message: mess,
        errors: exceptionData.errors,
      });
    } else {
      // if error is not http cause
      const status: number = HttpStatus.INTERNAL_SERVER_ERROR;
      const message: string = 'error';

      response.status(status).json({
        statusCode: status,
        server_time: new Date().toISOString(),
        status:message,
        message: exception || message,
      });
    }
  }
}
