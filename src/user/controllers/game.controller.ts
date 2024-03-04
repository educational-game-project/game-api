import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { GameService } from "../services/game.service";
import { ListGameByAuthorDTO } from "@app/common/dto/game.dto";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { Roles } from "@app/common/decorators/roles.decorator";
import { UserRole } from "@app/common/enums/role.enum";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";

@Roles([UserRole.USER])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  async updateLevel(@Body() body: ListGameByAuthorDTO, @Request() req): Promise<any> {
    return this.gameService.getListGame(body, req);
  }
}