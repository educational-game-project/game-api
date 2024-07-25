import { Body, Controller, HttpCode, HttpStatus, Post, Request as Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { LevelsService } from "../services/levels.service";
import { InitLevelDTO } from "@app/common/dto/levels.dto";
import { Roles } from "@app/common/decorators/roles.decorator";
import { UserRole } from "@app/common/enums/role.enum";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { ByIdDTO } from "@app/common/dto/byId.dto";
import { ApiBadRequestResponse, ApiBearerAuth, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

@ApiTags("Levels")
@Roles([UserRole.USER])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller("levels")
export class LevelsController {
  constructor(
    private readonly levelsService: LevelsService
  ) { }

  @Post("init")
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: "Init Level",
    description: "Init Level",
    tags: ["Levels"],
    operationId: "initLevel"
  })
  @ApiBearerAuth('Authorization')
  @ApiOkResponse({
    description: "Init Level successfully",
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
          example: "level_initiated_successfully",
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
              example: "5f8e9f0b0b0b0b0b0b0b0b0b",
            },
            current: {
              type: "number",
              example: 1
            },
            max: {
              type: "number",
              example: 1
            },
            liveLeft: {
              type: "number",
              example: 1
            },
            isValid: {
              type: "boolean",
              example: true
            },
            user: {
              type: "object",
              properties: {
                _id: {
                  type: "string",
                  example: "5f9e3c9b9b9b9b9b9b9b9b9b",
                },
                name: {
                  type: "string",
                  example: "John Doe",
                },
                email: {
                  type: "string",
                  example: "john@example.com",
                },
                role: {
                  type: "string",
                  example: "Admin",
                },
                phoneNUmber: {
                  type: "string",
                  example: "+628123456789",
                },
                deletedAt: {
                  type: "string",
                  example: null,
                },
                isActive: {
                  type: "boolean",
                  example: true,
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
                  }
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
                      example: 'School Name'
                    },
                    address: {
                      type: 'string',
                      example: 'School Address'
                    },
                    adminsCount: {
                      type: 'number',
                      example: 0
                    },
                    studentsCount: {
                      type: 'number',
                      example: 0
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
                },
                createdAt: {
                  type: "string",
                  example: "2022-05-01T00:00:00Z",
                },
                updatedAt: {
                  type: "string",
                  example: "2022-05-01T00:00:00Z",
                },
                __v: {
                  type: "number",
                  example: 0,
                },
              },
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
  @ApiNotFoundResponse({
    description: "Content Not Found",
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
  async initLevel(@Body() body: InitLevelDTO, @Req() req: Request): Promise<any> {
    return this.levelsService.initLevel(body, req);
  }

  @Post("find")
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: "Find Level",
    description: "Find Level",
    tags: ["Levels"],
    operationId: "findLevel"
  })
  @ApiBearerAuth('Authorization')
  @ApiOkResponse({
    description: "Find Level successfully",
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
          example: "level_initiated_successfully",
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
              example: "5f8e9f0b0b0b0b0b0b0b0b0b",
            },
            current: {
              type: "number",
              example: 1
            },
            max: {
              type: "number",
              example: 1
            },
            liveLeft: {
              type: "number",
              example: 1
            },
            isValid: {
              type: "boolean",
              example: true
            },
            user: {
              type: "object",
              properties: {
                _id: {
                  type: "string",
                  example: "5f9e3c9b9b9b9b9b9b9b9b9b",
                },
                name: {
                  type: "string",
                  example: "John Doe",
                },
                email: {
                  type: "string",
                  example: "john@example.com",
                },
                role: {
                  type: "string",
                  example: "Admin",
                },
                phoneNUmber: {
                  type: "string",
                  example: "+628123456789",
                },
                deletedAt: {
                  type: "string",
                  example: null,
                },
                isActive: {
                  type: "boolean",
                  example: true,
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
                  }
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
                      example: 'School Name'
                    },
                    address: {
                      type: 'string',
                      example: 'School Address'
                    },
                    adminsCount: {
                      type: 'number',
                      example: 0
                    },
                    studentsCount: {
                      type: 'number',
                      example: 0
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
                },
                createdAt: {
                  type: "string",
                  example: "2022-05-01T00:00:00Z",
                },
                updatedAt: {
                  type: "string",
                  example: "2022-05-01T00:00:00Z",
                },
                __v: {
                  type: "number",
                  example: 0,
                },
              },
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
  @ApiNotFoundResponse({
    description: "Content Not Found",
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
  async getLevel(@Body() body: ByIdDTO, @Req() req: Request): Promise<any> {
    return this.levelsService.getLevel(body, req);
  }
}
