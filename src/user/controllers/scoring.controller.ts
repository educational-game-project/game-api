import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ScoreService } from "src/user/services/scoring.service";

@Controller("score")
export class ScoreController {
  constructor(private scoreService: ScoreService) {}
}
