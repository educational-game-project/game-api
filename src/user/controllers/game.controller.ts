import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { GameService } from "../services/game.service";
import { ListGameByAuthorDTO } from "@app/common/dto/game.dto";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { Roles } from "@app/common/decorators/roles.decorator";
import { UserRole } from "@app/common/enums/role.enum";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { ApiBadRequestResponse, ApiBearerAuth, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

@ApiTags('Games')
@Roles([UserRole.USER])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('games')
export class GameController {
  constructor(
    private readonly gameService: GameService
  ) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: "Get List Game",
    description: "Get List Game By Author",
    tags: ['Games'],
    operationId: "Get-List-Game",
  })
  @ApiBearerAuth('Authorization')
  @ApiOkResponse({
    description: "Game List Fetched successfully",
    schema: {
      type: "object",
      properties: {
        statusCode: {
          type: "number",
          example: 200,
        },
        success: {
          type: "boolean",
          example: true,
        },
        status: {
          type: "string",
          example: "success",
        },
        message: {
          type: "string",
          example: "game_list_success",
        },
        server_time: {
          type: "string",
          example: "2022-05-01T00:00:00Z",
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: {
                type: "string",
                example: "5f8e9f0b0b0b0b0b0b0b0b0b",
              },
              name: {
                type: "string",
                example: "Game 1",
              },
              author: {
                type: "string",
                example: "John Doe",
              },
              description: {
                type: "string",
                example: "This is a game",
              },
              category: {
                type: "string",
                example: "Strategy",
              },
              maxLevel: {
                type: "number",
                example: 1,
              },
              maxRetry: {
                type: "number",
                example: 1,
              },
              maxTime: {
                type: "number",
                example: 1,
              },
              images: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string',
                      example: '623f1d9d6f9b3d7e5d7b6c7c'
                    },
                    originalName: {
                      type: 'string',
                      example: 'image.jpg'
                    },
                    fileName: {
                      type: 'string',
                      example: 'image.jpg'
                    },
                    fileLink: {
                      type: 'string',
                      example: 'https://example.com/image.jpg'
                    },
                    mimetType: {
                      type: 'string',
                      example: 'image/jpeg'
                    },
                    size: {
                      type: 'number',
                      example: 100
                    },
                    isDefault: {
                      type: 'boolean',
                      example: true
                    },
                    deletedAt: {
                      type: 'string',
                      example: null
                    },
                    createdAt: {
                      type: 'string',
                      example: '2022-05-01T00:00:00Z'
                    },
                    updatedAt: {
                      type: 'string',
                      example: '2022-05-01T00:00:00Z'
                    },
                    __v: {
                      type: 'number',
                      example: 0
                    }
                  }
                }
              },
              addedBy: {
                type: "string",
                example: "5f8e9f0b0b0b0b0b0b0b0b0b",
              },
              createdAt: {
                type: "string",
                example: "2022-05-01T00:00:00Z",
              },
              updatedAt: {
                type: "string",
                example: "2022-05-01T00:00:00Z",
              },
              deletedAt: {
                type: "string",
                example: null,
              },
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid Request Body",
    schema: {
      type: "object",
      properties: {
        statusCode: {
          type: "number",
          example: 400,
        },
        status: {
          type: "string",
          example: "error",
        },
        message: {
          type: "string",
          example: "Invalid Request Body!",
        },
        server_time: {
          type: "string",
          example: "2022-05-01T00:00:00Z",
        },
      }
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized",
    schema: {
      type: "object",
      properties: {
        statusCode: {
          type: "number",
          example: 401,
        },
        status: {
          type: "string",
          example: "error",
        },
        message: {
          type: "string",
          example: "Unauthorized",
        },
        server_time: {
          type: "string",
          example: "2022-05-01T00:00:00Z",
        },
      }
    }
  })
  @ApiNotFoundResponse({
    description: "Game Not Found",
    schema: {
      type: "object",
      properties: {
        statusCode: {
          type: "number",
          example: 404,
        },
        status: {
          type: "string",
          example: "error",
        },
        message: {
          type: "string",
          example: "game_not_found",
        },
        server_time: {
          type: "string",
          example: "2022-05-01T00:00:00Z",
        },
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Server Error",
    schema: {
      type: "object",
      properties: {
        statusCode: {
          type: "number",
          example: 500,
        },
        status: {
          type: "string",
          example: "error",
        },
        message: {
          type: "string",
          example: "Internal Server Error",
        },
        server_time: {
          type: "string",
          example: "2022-05-01T00:00:00Z",
        },
      }
    }
  })
  async getListGame(@Body() body: ListGameByAuthorDTO, @Request() req): Promise<any> {
    return this.gameService.getListGame(body, req);
  }
}