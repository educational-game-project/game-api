import { Controller, } from "@nestjs/common";
import { ScoreAdminService } from "../services/scoring.service";

@Controller("admin/score")
export class ScoreAdminController {
  constructor(private scoreService: ScoreAdminService) { }
}
