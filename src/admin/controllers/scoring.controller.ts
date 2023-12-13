import { Request, Controller, Get, Post, Body, Patch, Param, Delete, } from "@nestjs/common";
import { ScoreAdminService } from "../services/scoring.service";

@Controller("admin/score")
export class ScoreAdminController {
  constructor(private scoreService: ScoreAdminService) { }
}
