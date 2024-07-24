import { AuthenticationGuard } from "@app/common/auth/authentication.guard";
import { AuthorizationGuard } from "@app/common/auth/authorization.guard";
import { Controller, Get, HttpCode, HttpStatus, Request, UseGuards } from "@nestjs/common";
import { DashboardService } from "../services/dashboard.service";
import { Roles } from "@app/common/decorators/roles.decorator";
import { UserRole } from "@app/common/enums/role.enum";
import { ResponseStatusCode } from "@app/common/response/response.decorator";
import { SchedulerService } from '../services/scheduler.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

@ApiTags("Admin - Dashboard")
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller("admin/dashboard")
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) { }

  @Get()
  @Roles([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseStatusCode()
  @ApiOperation({
    summary: 'Get Dashboard Info',
    description: 'This endpoint allows admins to get dashboard info.',
    tags: ["Admin", "Dashboard"],
    operationId: "Get-Dashboard-Info",
  })
  @ApiBearerAuth('Authorization')
  @ApiOkResponse({
    description: "Get dashboard successfully",
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
        data: {
          type: "object",
          properties: {
            studentsCount: {
              type: "number",
              example: 24,
            },
            activeStudents: {
              type: "number",
              example: 24,
            },
            adminCount: {
              type: "number",
              example: 24,
            },
            admins: {
              type: "number",
              example: 24,
            },
            activeAdmin: {
              type: "number",
              example: 24,
            },
            gameCount: {
              type: "number",
              example: 24,
            },
            games: {
              type: "number",
              example: 24,
            },
            schoolCount: {
              type: "number",
              example: 24,
            },
            schools: {
              type: "number",
              example: 24,
            },
          }
        }
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
  getDashboard(@Request() req: any) {
    return this.dashboardService.getDashboardInfo(req.user)
  }
}