import { Controller } from "@nestjs/common";
import { LogsService } from "../services/log.service";

@Controller('admin/logs')
export class LogsController {
  constructor(
    private readonly logsService: LogsService,
  ) { }
}