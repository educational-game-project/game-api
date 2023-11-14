import { Request, Controller, Get, Post, Body, Patch, Param, Delete, } from '@nestjs/common';
import { LevelsAdminService } from '../services/levels.service';

@Controller('admin/levels')
export class LevelsAdminController {
  constructor(private readonly levelsService: LevelsAdminService) { }
}
