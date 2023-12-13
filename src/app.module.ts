import { join } from "path";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AppService } from "./user/services/app.service";
import { ServeStaticModule } from "@nestjs/serve-static";
import { AuthService } from "./user/services/auth.service";
import { AuthHelper } from "@app/common/helpers/auth.helper";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LevelsService } from "./user/services/levels.service";
import { ScoreService } from "./user/services/scoring.service";
import { RecordService } from "./user/services/record.service";
import { AuthAdminService } from "./admin/services/auth.service";
import { UserAdminService } from "./admin/services/user.service";
import { ImagesService } from "@app/common/helpers/file.helpers";
import { AppController } from "./user/controllers/app.controller";
import { FileUploader } from "@app/common/utils/fileUploader.util";
import { DatabaseModule } from "@app/common/model/database.module";
import { AuthController } from "./user/controllers/auth.controller";
import { RecordAdminService } from "./admin/services/record.service";
import { LevelsAdminService } from "./admin/services/levels.service";
import { ReportAdminService } from "./admin/services/report.service";
import { ScoreAdminService } from "./admin/services/scoring.service";
import { SchoolAdminService } from "./admin/services/schools.service";
import { ResponseService } from "@app/common/response/response.service";
import { RecordController } from "./user/controllers/record.controller";
import { LevelsController } from "./user/controllers/levels.controller";
import { ScoreController } from "./user/controllers/scoring.controller";
import { AnalysisAdminService } from "./admin/services/analysis.service";
import { AuthAdminController } from "./admin/controllers/auth.controller";
import { UserAdminController } from "./admin/controllers/user.controller";
import { MongooseModulesImport } from "@app/common/model/database.service";
import { LevelsAdminController } from "./admin/controllers/levels.controller";
import { ScoreAdminController } from "./admin/controllers/scoring.controller";
import { RecordAdminController } from "./admin/controllers/record.controller";
import { ReportAdminController } from "./admin/controllers/report.controller";
import { SchoolAdminController } from "./admin/controllers/schools.controller";
import { AnalysisAdminController } from "./admin/controllers/analysis.controller";

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, ".."),
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    LevelsController,
    ScoreController,
    AnalysisAdminController,
    AuthAdminController,
    LevelsAdminController,
    RecordAdminController,
    ReportAdminController,
    SchoolAdminController,
    ScoreAdminController,
    UserAdminController,
    RecordController,
  ],
  providers: [
    AuthHelper,
    ImagesService,
    ResponseService,
    AppService,
    AuthService,
    LevelsService,
    ScoreService,
    AnalysisAdminService,
    AuthAdminService,
    LevelsAdminService,
    RecordAdminService,
    ReportAdminService,
    SchoolAdminService,
    ScoreAdminService,
    UserAdminService,
    RecordService,
    FileUploader,
  ],
})
export class AppModule { }
