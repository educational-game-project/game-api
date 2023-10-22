import { PartialType } from '@nestjs/mapped-types';

export class CreateAuthDto {}

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
