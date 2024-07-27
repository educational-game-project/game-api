import { Controller, Post, Body, Request, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LoginUserDTO, ReauthDTO } from "@app/common/dto/auth.dto";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { Roles } from "@app/common/decorators/roles.decorator";
import { UserRole } from "@app/common/enums/role.enum";
import { ApiBadRequestResponse, ApiBearerAuth, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: 'Login',
    description: 'This endpoint allows users to login.',
    tags: ["User", "Auth"],
    operationId: "Login",
  })
  @ApiOkResponse({
    description: "Login successfully",
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
          type: "object",
          properties: {
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
            tokens: {
              type: "object",
              properties: {
                accessToken: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
                refreshToken: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
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
  @ApiNotFoundResponse({
    description: "User Not Found",
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
          example: "user_not_found",
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
  async login(@Body() body: LoginUserDTO): Promise<any> {
    return this.authService.login(body);
  }

  @Post("refresh-token")
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: 'Refresh Token',
    description: 'This endpoint allows users to refresh token.',
    tags: ["User", "Auth"],
    operationId: "Refresh-Token",
  })
  @ApiOkResponse({
    description: "Login successfully",
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
          type: "object",
          properties: {
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
            tokens: {
              type: "object",
              properties: {
                accessToken: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
                refreshToken: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
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
  @ApiNotFoundResponse({
    description: "User Not Found",
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
          example: "user_not_found",
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
  async verifyRefreshToken(@Body() body: ReauthDTO, @Request() req) {
    return this.authService.verifyRefreshToken(body, req);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @Roles([UserRole.USER])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ResponseStatusCode()
  @ApiOperation({
    summary: 'Logout',
    description: 'This endpoint allows users to logout.',
    tags: ["User", "Auth"],
    operationId: "Logout",
  })
  @ApiBearerAuth('Authorization')
  @ApiOkResponse({
    description: "Logout successfully",
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
          example: "auth_logout_success",
        },
        server_time: {
          type: "string",
          example: "2022-05-01T00:00:00Z",
        },
      },
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
  async logout(@Request() req) {
    return this.authService.logout(req);
  }
}
