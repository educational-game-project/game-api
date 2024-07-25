import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { Request } from "express";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { Roles } from "@app/common/decorators/roles.decorator";
import { CreateReportDTO } from "@app/common/dto/report.dto";
import { UserRole } from "@app/common/enums/role.enum";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { Controller, Post, Body, UseGuards, Request as Req, HttpStatus, HttpCode } from "@nestjs/common";
import { RecordService } from "src/user/services/record.service";
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

@ApiTags("Records")
@Roles([UserRole.USER])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller("record")
export class RecordController {
  constructor(
    private readonly recordService: RecordService
  ) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: "Record a new report",
    description: "Record a new report",
    tags: ["Records"],
    operationId: "record"
  })
  @ApiOkResponse({
    description: "Record Success",
    schema: {
      type: "object",
      properties: {
        statusCode: {
          type: "number",
          example: 200,
        },
        status: {
          type: "string",
          example: "success",
        },
        message: {
          type: "string",
          example: "record_add_success",
        },
        server_time: {
          type: "string",
          example: "2022-05-01T00:00:00Z",
        },
        data: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "5f9e3c9b9b9b9b9b9b9b9b9b",
            },
            level: {
              type: "number",
              example: 1,
            },
            time: {
              type: 'array',
              items: {
                type: 'number',
                example: 10
              }
            },
            liveLeft: {
              type: "number",
              example: 1
            },
            count: {
              type: "number",
              example: 1
            },
            status: {
              type: "string",
              example: "Passed"
            },
            isValid: {
              type: "boolean",
              example: true
            },
            user: {
              type: "string",
              example: "5f9e3c9b9b9b9b9b9b9b9b9b",
            },
            game: {
              type: "object",
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
                      editedAt: {
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
            created_at: {
              type: "string",
              example: "2022-05-01T00:00:00Z",
            },
            updated_at: {
              type: "string",
              example: "2022-05-01T00:00:00Z",
            },
          }
        }
      }
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
  async record(@Body() body: CreateReportDTO, @Req() req: Request): Promise<any> {
    return this.recordService.record(body, req);
  }
}
