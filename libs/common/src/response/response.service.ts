import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
  ValidationError,
} from "@nestjs/common";
import {
  IResponseError,
  IResponsePaging,
  RMessage,
  RSuccessMessage,
} from "./response.interface";
import { Request, Response } from "express";

@Injectable()
export class ResponseService {
  constructor() {}

  error(
    statusCode: number,
    message: string,
    errors?: RMessage,
  ): IResponseError {
    if (errors) {
      return {
        statusCode: statusCode,
        status: "error",
        message: message.toString(),
        server_time: new Date().toISOString(),
        error: [errors],
      };
    }

    return {
      statusCode: statusCode,
      status: "error",
      message: message.toString(),
      server_time: new Date().toISOString(),
    };
  }

  success(
    success: boolean,
    message: string,
    data?: Record<string, any> | Record<string, any>[],
    meta?: Record<string, any>,
  ): RSuccessMessage {
    if (data) {
      return {
        success: success,
        status: "success",
        message: message,
        server_time: new Date().toISOString(),
        data: data,
        meta,
      };
    }

    return {
      success: success,
      status: "success",
      server_time: new Date().toISOString(),
      message: message,
      meta,
    };
  }

  paging(
    message: string,
    data: Record<string, any>[],
    page: {
      totalData: number;
      totalPage: number;
      currentPage: number;
      perPage: number;
    },
  ): IResponsePaging {
    return {
      message,
      status: "success",
      server_time: new Date().toISOString(),
      data,
      page,
    };
  }

  validationError(statusCode: number, errors: ValidationError[]): any {
    const response = {
      statusCode,
      status: "error",
      server_time: new Date().toISOString(),
      message: [],
    };
    for (const err of errors)
      Object.values(err.constraints).map((cons) => {
        response.message.push(cons);
      });
    return response;
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse == "string") {
      response.status(status).json({
        statusCode: status,
        status: false,
        message: exceptionResponse.toString(),
        server_time: new Date().toISOString(),
      });
    } else if (typeof exceptionResponse["message"] == "object") {
      response.status(status).json({
        statusCode: exceptionResponse["statusCode"],
        status: false,
        message: exceptionResponse["error"].toString(),
        server_time: new Date().toISOString(),
        error: exceptionResponse["message"],
      });
    } else {
      response.status(status).json({
        statusCode: status,
        status: false,
        message: "Forbidden",
        server_time: new Date().toISOString(),
      });
    }

    response.status(status);
  }
}
