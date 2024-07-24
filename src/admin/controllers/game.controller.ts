import { Body, Controller, Delete, HttpStatus, Inject, Logger, Post, Put, Req, UploadedFiles, UseGuards, UseInterceptors, HttpException, HttpCode, } from "@nestjs/common";
import { GameAdminService } from "../services/game.service";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { Roles } from "@app/common/decorators/roles.decorator";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { UserRole } from "@app/common/enums/role.enum";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { Request } from "express";
import { imageFilter, limitImageUpload, } from "@app/common/utils/validators/file.validator";
import { ImagesService } from "@app/common/helpers/file.helpers";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { DefineGameDTO, EditGameDTO, ListGameDTO } from "@app/common/dto/game.dto";
import { ByIdDTO } from "@app/common/dto/byId.dto";
import { LogsService } from "../services/log.service";
import { TargetLogEnum } from "@app/common/enums/log.enum";
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, getSchemaPath } from "@nestjs/swagger";

@ApiTags("Admin - Games")
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller("admin/games")
export class GameAdminController {
  constructor(
    private readonly gameService: GameAdminService,
    @Inject(ImagesService) private imageService: ImagesService,
    @Inject(LogsService) private readonly logsService: LogsService,
  ) { }

  private readonly logger = new Logger(GameAdminController.name);

  @Post()
  @Roles([UserRole.SUPER_ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @UseInterceptors(
    AnyFilesInterceptor({
      fileFilter: imageFilter,
      limits: limitImageUpload(),
    }),
  )
  @ApiOperation({
    summary: "Add Game",
    description: "Add New Game",
    tags: ["Admin", "Games"],
    operationId: "Add-Game",
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          nullable: false,
          example: "Game Name",
        },
        description: {
          type: "string",
          example: "Game Description",
        },
        author: {
          type: "string",
          example: "Game Author",
        },
        category: {
          type: "string",
          example: "Game Category",
        },
        maxLevel: {
          type: "number",
          example: 10,
        },
        maxRetry: {
          type: "number",
          example: 10,
        },
        maxTime: {
          type: "number",
          example: 10,
        },
        media: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: "Game added successfully",
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
          example: "Game Add Success!",
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
          example: "Game Already Exist!",
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
  async defineGame(
    @Body() body: DefineGameDTO,
    @UploadedFiles() media: Array<Express.Multer.File>,
    @Req() req: any,
  ): Promise<any> {
    try {
      const files = media ? await this.imageService.define(media) : [];

      return this.gameService.defineGame(body, files, req);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.GAME,
        description: `${req?.user?.name} failed to add game`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.defineGame.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put()
  @Roles([UserRole.SUPER_ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @UseInterceptors(
    AnyFilesInterceptor({
      fileFilter: imageFilter,
      limits: limitImageUpload(),
    }),
  )
  @ApiOperation({
    summary: "Edit Game",
    description: "Edit Game",
    tags: ["Admin", "Games"],
    operationId: "Edit-Game",
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          nullable: false,
          example: "5f9e3c9b9b9b9b9b9b9b9b9b",
        },
        name: {
          type: "string",
          nullable: false,
          example: "Game Name",
        },
        description: {
          type: "string",
          example: "Game Description",
        },
        author: {
          type: "string",
          example: "Game Author",
        },
        category: {
          type: "string",
          example: "Game Category",
        },
        maxLevel: {
          type: "number",
          example: 10,
        },
        maxRetry: {
          type: "number",
          example: 10,
        },
        maxTime: {
          type: "number",
          example: 10,
        },
        media: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: "Game edited successfully",
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
          example: "Game Edit Success!",
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
          example: "Game Not Found!",
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
  async editGame(
    @Body() body: EditGameDTO,
    @UploadedFiles() media: Array<Express.Multer.File>,
    @Req() req: any,
  ): Promise<any> {
    try {
      const files = media ? await this.imageService.define(media) : [];

      return this.gameService.editGame(body, files, req);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.GAME,
        description: `${req?.user?.name} failed to edit game`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.editGame.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('find')
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: "Game List",
    description: "Search Game List",
    tags: ["Admin", "Games"],
    operationId: "Game-List",
  })
  @ApiOkResponse({
    description: "Game fetched successfully",
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
          example: "Game List Success!",
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
                type: 'string',
                example: '623f1d9d6f9b3d7e5d7b6c7c'
              },
              name: {
                type: 'string',
                example: "Game 1"
              },
              description: {
                type: 'string',
                example: "Game 1"
              },
              category: {
                type: 'string',
                example: "Game 1"
              },
              maxLevel: {
                type: 'number',
                example: 1
              },
              maxRetry: {
                type: 'number',
                example: 1
              },
              maxTime: {
                type: 'number',
                example: 1
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
                type: 'object',
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
                  role: {
                    type: 'string',
                    example: "ADMIN"
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
              }
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
          example: "Game Not Found!",
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
  async listGame(@Body() body: ListGameDTO, @Req() req: Request): Promise<any> {
    return this.gameService.listGame(body, req);
  }

  @Post('detail')
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: "Detail Game",
    description: "Detail Game",
    tags: ["Admin", "Games"],
    operationId: "Game-Detail",
  })
  @ApiOkResponse({
    description: "Game Detail Fetched successfully",
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
          example: "Game List Success!",
        },
        server_time: {
          type: "string",
          example: "2022-05-01T00:00:00Z",
        },
        data: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '623f1d9d6f9b3d7e5d7b6c7c'
            },
            name: {
              type: 'string',
              example: "Game 1"
            },
            description: {
              type: 'string',
              example: "Game 1"
            },
            category: {
              type: 'string',
              example: "Game 1"
            },
            maxLevel: {
              type: 'number',
              example: 1
            },
            maxRetry: {
              type: 'number',
              example: 1
            },
            maxTime: {
              type: 'number',
              example: 1
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
              type: 'object',
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
                role: {
                  type: 'string',
                  example: "ADMIN"
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
            }
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
          example: "Game Not Found!",
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
  async detailGame(@Body() body: ByIdDTO, @Req() req: Request): Promise<any> {
    return this.gameService.detailGame(body, req);
  }

  @Delete()
  @Roles([UserRole.SUPER_ADMIN])
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: "Delete Game",
    description: "Delete Game",
    tags: ["Admin", "Games"],
    operationId: "Game-Delete",
  })
  @ApiOkResponse({
    description: "Game deleted successfully",
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
          example: "Game Delete Success!",
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
          example: "Game Not Found!",
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
  async deleteGame(@Body() body: ByIdDTO, @Req() req: Request): Promise<any> {
    return this.gameService.deleteGame(body, req);
  }
}