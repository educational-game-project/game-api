import { FileInterceptor, AnyFilesInterceptor } from "@nestjs/platform-express";
import { SchoolAdminService } from "../services/schools.service";
import { Body, Controller, Delete, HttpStatus, Inject, Logger, Post, Put, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, HttpException, HttpCode, } from "@nestjs/common";
import { Request } from "express";
import { imageFilter, limitImageUpload, } from "@app/common/utils/validators/file.validator";
import { ImageService } from "@app/common/helpers/file.helpers";
import { CreateSchoolDTO, EditSchoolDTO } from "@app/common/dto/school.dto";
import { SearchDTO } from "@app/common/dto/search.dto";
import { ByIdDTO } from "@app/common/dto/byId.dto";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { Roles } from "@app/common/decorators/roles.decorator";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { UserRole } from "@app/common/enums/role.enum";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { TargetLogEnum } from "@app/common/enums/log.enum";
import { LogService } from "../services/log.service";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, getSchemaPath } from "@nestjs/swagger";

@ApiTags("Admin-Schools")
@Roles([UserRole.SUPER_ADMIN])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller("admin/school")
export class SchoolAdminController {
  constructor(
    private schoolService: SchoolAdminService,
    @Inject(ImageService) private imageService: ImageService,
    @Inject(LogService) private readonly logService: LogService,
  ) { }

  private readonly logger = new Logger(SchoolAdminService.name);

  @Post()
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @UseInterceptors(
    FileInterceptor("media", {
      fileFilter: imageFilter,
      limits: limitImageUpload(),
    }),
  )
  @ApiOperation({
    summary: "Add School",
    description: "Add School",
    tags: ["Admin", 'School-Management', 'Add-School'],
    operationId: "Add-School",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBearerAuth('Authorization')
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          nullable: false,
          example: "School Name",
        },
        address: {
          type: "string",
          example: "123 Main St",
          nullable: true,
        },
        media: {
          type: "string",
          format: "binary",
          nullable: true,
        },
      }
    }
  })
  @ApiOkResponse({
    description: "School Added Successfully",
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
          example: "School Added Success!",
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
  async createSchool(
    @Body() body: CreateSchoolDTO,
    @UploadedFile() media: Express.Multer.File,
    @Req() req: any,
  ): Promise<any> {
    try {
      const files = media ? await this.imageService.define([media]) : [];

      return this.schoolService.create(body, files, req);
    } catch (error) {
      await this.logService.logging({
        target: TargetLogEnum.SCHOOL,
        description: `${req?.user?.name} failed to add school`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.createSchool.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @UseInterceptors(
    AnyFilesInterceptor({
      fileFilter: imageFilter,
      limits: limitImageUpload(),
    }),
  )
  @ApiOperation({
    summary: "Edit School",
    description: "Edit School",
    tags: ["Admin", 'School-Management', 'Edit-School'],
    operationId: "Edit-School",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBearerAuth('Authorization')
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          nullable: false,
          example: "5f8f8f8f8f8f8f8f8f8f8f8f",
        },
        name: {
          type: "string",
          nullable: false,
          example: "School Name",
        },
        address: {
          type: "string",
          example: "123 Main St",
          nullable: true,
        },
        mediaIds: {
          type: "array",
          items: {
            type: "string",
            example: "5f8f8f8f8f8f8f8f8f8f8f8f",
          },
          nullable: true,
        },
        media: {
          type: "string",
          format: "binary",
          nullable: true,
        },
      }
    }
  })
  @ApiOkResponse({
    description: "School Edited Successfully",
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
          example: "School Edited Success!",
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
  async editSchool(
    @Body() body: EditSchoolDTO,
    @UploadedFiles() media: Array<Express.Multer.File>,
    @Req() req: any,
  ): Promise<any> {
    try {
      const files = media?.length ? await this.imageService.define(media) : [];

      return this.schoolService.edit(body, files, req);
    } catch (error) {
      await this.logService.logging({
        target: TargetLogEnum.SCHOOL,
        description: `${req?.user?.name} failed to edit school`,
        success: false,
        summary: JSON.stringify(body),
      })
      this.logger.error(this.editSchool.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("find")
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: "Find School",
    description: "Find School",
    tags: ["Admin", 'School-Management', 'Find-School'],
    operationId: "Find-School",
  })
  @ApiBearerAuth('Authorization')
  @ApiOkResponse({
    description: "Schools Found",
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
          example: "Schools Found!",
        },
        server_time: {
          type: "string",
          example: "2022-05-01T00:00:00Z",
        },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                example: "1",
              },
              name: {
                type: "string",
                example: "School 1",
              },
              address: {
                type: "string",
                example: "School 1 Address",
              },
              studentsCount: {
                type: "number",
                example: 10,
              },
              adminsCount: {
                type: "number",
                example: 10,
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
                      updatedAt: {
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
            },
          }
        }
      }
    }
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
  async findSchool(@Body() body: SearchDTO, @Req() req: Request): Promise<any> {
    return this.schoolService.find(body, req);
  }

  @Post("detail")
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: "Detail School",
    description: "Detail School",
    tags: ["Admin", 'School-Management', 'Detail-School'],
    operationId: "Detail-School",
  })
  @ApiBearerAuth('Authorization')
  @ApiOkResponse({
    description: "Schools Found",
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
          example: "Schools Found!",
        },
        server_time: {
          type: "string",
          example: "2022-05-01T00:00:00Z",
        },
        data: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "1",
            },
            name: {
              type: "string",
              example: "School 1",
            },
            address: {
              type: "string",
              example: "School 1 Address",
            },
            studentsCount: {
              type: "number",
              example: 10,
            },
            adminsCount: {
              type: "number",
              example: 10,
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
            admins: {
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
                      updatedAt: {
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
          },
        }
      }
    }
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
  async detailSchool(@Body() body: ByIdDTO, @Req() req: Request): Promise<any> {
    return this.schoolService.detail(body, req);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: "Delete School",
    description: "Delete School",
    tags: ["Admin", 'School-Management', 'Delete-School'],
    operationId: "Delete-School",
  })
  @ApiBearerAuth('Authorization')
  @ApiOkResponse({
    description: "Success",
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
          example: "Success",
        },
        server_time: {
          type: "string",
          example: "2022-05-01T00:00:00Z",
        },
      }
    }
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
  async deleteSchool(@Body() body: ByIdDTO, @Req() req: Request): Promise<any> {
    return this.schoolService.delete(body, req);
  }
}
