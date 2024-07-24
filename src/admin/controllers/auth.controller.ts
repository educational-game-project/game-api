import { Request, Controller, Post, Body, UseGuards, HttpStatus, HttpCode } from "@nestjs/common";
import { AuthAdminService } from "../services/auth.service";
import { ChangePasswordDTO, LoginAdminDTO, ReauthDTO } from "@app/common/dto/auth.dto";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { UserRole } from "@app/common/enums/role.enum";
import { Roles } from "@app/common/decorators/roles.decorator";
import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { ApiBadRequestResponse, ApiBearerAuth, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

@ApiTags("Admin - Auth")
@Controller("admin/auth")
export class AuthAdminController {
  constructor(
    private readonly authService: AuthAdminService
  ) { }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: 'Login Admin',
    description: 'Login Admin',
    tags: ["Admin", "Auth", "Login"],
    operationId: "Login-Admin",
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
          example: "Auth Login Success!",
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
                  type: 'string',
                  example: "5f9e3c9b9b9b9b9b9b9b9b9b"
                },
                school: {
                  type: 'string',
                  example: "5f9e3c9b9b9b9b9b9b9b9b9b"
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
                  example:
                    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                },
                refreshToken: {
                  type: "string",
                  example:
                    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
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
          example: "Password is incorrect!",
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
          example: "User Not Found!",
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
  async login(@Body() body: LoginAdminDTO) {
    return this.authService.login(body);
  }

  @Post("refresh-token")
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: 'Refresh Access Token',
    description: 'Refresh Access Token',
    tags: ["Admin", "Auth", "Access Token"],
    operationId: "Refresh-Access-Token",
  })
  @ApiOkResponse({
    description: "Auth Verify RefreshToken successfully",
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
          example: "Auth Verify RefreshToken Success!",
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
                  type: 'string',
                  example: "5f9e3c9b9b9b9b9b9b9b9b9b"
                },
                school: {
                  type: 'string',
                  example: "5f9e3c9b9b9b9b9b9b9b9b9b"
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
                  example:
                    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                },
                refreshToken: {
                  type: "string",
                  example:
                    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
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

  @Post('change-password')
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: 'Change Admin Password',
    description: 'This endpoint allows admins to change their password.',
    tags: ["Admin", "Auth", "Change Password"],
    operationId: "Change-Admin-Password",
  })
  @ApiBearerAuth('Authorization')
  @ApiOkResponse({
    description: "Auth Change Password successfully",
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
          example: "Auth Change Password Success!",
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
          example: "Password is incorrect!",
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
          example: "User Not Found!",
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
  async changePassword(@Body() body: ChangePasswordDTO, @Request() req) {
    return this.authService.changePassword(body, req);
  }

  @Post('logout')
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: 'Logout Admin',
    description: 'This endpoint allows admins to logout.',
    tags: ["Admin", "Auth", "Logout"],
    operationId: "Admin-Logout",
  })
  @ApiBearerAuth('Authorization')
  @ApiOkResponse({
    description: "Auth Logout successfully",
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
          example: "Auth Logout Success!",
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
          example: "Password is incorrect!",
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
  async logout(@Request() req) {
    return this.authService.logout(req);
  }
}
