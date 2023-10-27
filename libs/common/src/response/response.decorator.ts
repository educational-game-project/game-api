import {
  applyDecorators,
  Inject,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseFilter } from './response.filter';
import { ResponseInterceptor } from './response.interceptor';
import { IApplyDecorator } from './response.interface';

export function Response(): (
  target: Record<string, any>,
  key: string | symbol | boolean,
  index?: number,
) => void {
  return Inject(`ResponseService`);
}

export function ResponseStatusCode(): IApplyDecorator {
  return applyDecorators(
    UseInterceptors(ResponseInterceptor),
    UseFilters(ResponseFilter),
  );
}
