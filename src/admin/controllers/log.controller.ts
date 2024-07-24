import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Request as Req, UseGuards } from "@nestjs/common";
import { LogsService } from "../services/log.service";
import { UserRole } from "@app/common/enums/role.enum";
import { Roles } from "@app/common/decorators/roles.decorator";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { Request } from "express";
import { SearchDTO } from "@app/common/dto/search.dto";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { ByIdDTO } from "@app/common/dto/byId.dto";
import { ApiBadRequestResponse, ApiBearerAuth, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { TargetLogEnum } from "@app/common/enums/log.enum";

@ApiTags("Admin - Logs")
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
@Controller('admin/logs')
export class LogsController {
  constructor(
    private readonly logsService: LogsService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: "Get Logs History",
    description: "Get Logs Activity in System",
    tags: ['Admin', "Logs", 'History'],
    operationId: "Admin-Logs-History"
  })
  @ApiBearerAuth('Authorization')
  @ApiOkResponse({
    description: "Logs History fetched successfully",
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
          example: "Logs Histories Success!",
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
              actor: {
                type: "object",
                properties: {
                  _id: {
                    type: 'string',
                    example: '623f1d9d6f9b3d7e5d7b6c7c'
                  },
                  name: {
                    type: 'string',
                    example: "User 1"
                  },
                  email: {
                    type: 'string',
                    example: "5sXKw@example.com"
                  },
                  phoneNumber: {
                    type: 'string',
                    example: "+6288888888888"
                  },
                  isActive: {
                    type: 'boolean',
                    example: true
                  },
                  image: {
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
                    },
                  },
                  school: {
                    type: 'object',
                    properties: {
                      _id: {
                        type: 'string',
                        example: '623f1d9d6f9b3d7e5d7b6c7c'
                      },
                      name: {
                        type: 'string',
                        example: "School 1"
                      },
                      address: {
                        type: 'string',
                        example: "street 1"
                      },
                    }
                  }
                }
              },
              target: {
                type: 'string',
                example: "GAME",
                enum: [...Object.values(TargetLogEnum)]
              },
              method: {
                type: 'string',
                example: "GET"
              },
              userAgent: {
                type: 'string',
                example: "Chrome"
              },
              description: {
                type: 'string',
                example: "Get Game Data"
              },
              summary: {
                type: 'string',
                example: "Get Game Data"
              },
              success: {
                type: 'boolean',
                example: true
              },
              createdAt: {
                type: 'string',
                example: '2022-05-01T00:00:00Z'
              },
            }
          }
        },
        page: {
          type: 'object',
          properties: {
            totalData: {
              type: 'number',
              example: 10
            },
            totalPage: {
              type: 'number',
              example: 10
            },
            currentPage: {
              type: 'number',
              example: 10
            },
            perPage: {
              type: 'number',
              example: 10
            },
          }
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
  async getLogs(@Body() body: SearchDTO, @Req() req: Request) {
    return await this.logsService.getLogs(body, req);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: "Delete Log History",
    description: "Delete Log Activity in System",
    tags: ['Admin', "Logs", 'Delete'],
    operationId: "Admin-Logs-Delete"
  })
  @ApiBearerAuth('Authorization')
  @ApiOkResponse({
    description: "Log Deleted successfully",
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
          example: "Log Delete Success!",
        },
        server_time: {
          type: "string",
          example: "2022-05-01T00:00:00Z",
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
  @ApiNotFoundResponse({
    description: "Log Not Found",
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
          example: "Log Not Found!",
        },
        server_time: {
          type: "string",
          example: "2022-05-01T00:00:00Z",
        },
      }
    }
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
  async deleteLog(@Body() body: ByIdDTO, @Req() req: Request) {
    return await this.logsService.deleteLog(body, req);
  }
}