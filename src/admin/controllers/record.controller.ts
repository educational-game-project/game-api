import {
  Request,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RecordAdminService } from '../services/record.service';

@Controller('admin/record')
export class RecordAdminController {
  constructor(private readonly recordService: RecordAdminService) {}
}
