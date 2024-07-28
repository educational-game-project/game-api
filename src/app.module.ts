import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { AppService } from "./user/services/app.service";
import { AuthService } from "./user/services/auth.service";
import { LogService } from "./admin/services/log.service";
import { GameService } from "./user/services/game.service";
import { AuthHelper } from "@app/common/helpers/auth.helper";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LevelService } from "./user/services/levels.service";
import { ScoreService } from "./user/services/scoring.service";
import { RecordService } from "./user/services/record.service";
import { AuthAdminService } from "./admin/services/auth.service";
import { UserAdminService } from "./admin/services/user.service";
import { ImageService } from "@app/common/helpers/file.helpers";
import { GameAdminService } from "./admin/services/game.service";
import { AppController } from "./user/controllers/app.controller";
import { FileUploader } from "@app/common/utils/fileUploader.util";
import { DatabaseModule } from "@app/common/model/database.module";
import { StudentsService } from "./admin/services/students.service";
import { AuthController } from "./user/controllers/auth.controller";
import { GameController } from "./user/controllers/game.controller";
import { LogsController } from "./admin/controllers/log.controller";
import { ScoreAdminService } from "./admin/services/scoring.service";
import { DashboardService } from "./admin/services/dashboard.service";
import { SchoolAdminService } from "./admin/services/schools.service";
import { SchedulerService } from "./admin/services/scheduler.service";
import { ScoreCalculateHelper } from "@app/common/helpers/score.helper";
import { ResponseService } from "@app/common/response/response.service";
import { RecordController } from "./user/controllers/record.controller";
import { LevelController } from "./user/controllers/levels.controller";
import { ScoreController } from "./user/controllers/scoring.controller";
import { AuthAdminController } from "./admin/controllers/auth.controller";
import { UserAdminController } from "./admin/controllers/user.controller";
import { GameAdminController } from "./admin/controllers/game.controller";
import { MongooseModulesImport } from "@app/common/model/database.service";
import { ScoreAdminController } from "./admin/controllers/scoring.controller";
import { SchoolAdminController } from "./admin/controllers/schools.controller";
import { DashboardController } from "./admin/controllers/dashboard.controller";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: config.get("JWT_EXPIRES") },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    DatabaseModule,
    MongooseModule.forFeature(MongooseModulesImport),
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AppController,
    LogsController,
    GameController,
    AuthController,
    ScoreController,
    LevelController,
    RecordController,
    AuthAdminController,
    UserAdminController,
    GameAdminController,
    DashboardController,
    ScoreAdminController,
    SchoolAdminController,
  ],
  providers: [
    AuthHelper,
    AppService,
    LogService,
    GameService,
    AuthService,
    ScoreService,
    FileUploader,
    ImageService,
    LevelService,
    RecordService,
    ResponseService,
    StudentsService,
    GameAdminService,
    DashboardService,
    AuthAdminService,
    SchedulerService,
    UserAdminService,
    ScoreAdminService,
    SchoolAdminService,
    ScoreCalculateHelper,
  ],
})
export class AppModule { }
