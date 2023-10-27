import { SchoolAdminService } from '../services/schools.service';
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';

@Controller('admin/schools')
export class SchoolAdminController {
    constructor(private schoolService: SchoolAdminService) { }
}
