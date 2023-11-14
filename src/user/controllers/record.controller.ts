import { Controller, Get, Post, Body, Patch, Param, Delete, } from '@nestjs/common';
import { RecordService } from 'src/user/services/record.service';

@Controller('record')
export class RecordController {
  constructor(private readonly recordService: RecordService) { }
}
