import { join } from 'path';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './user/services/app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthService } from './user/services/auth.service';
import { UserService } from './user/services/user.service';
import { AuthHelper } from '@app/common/helpers/auth.helper';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LevelsService } from './user/services/levels.service';
import { ScoreService } from './user/services/scoring.service';
import { RecordService } from './user/services/record.service';
import { AuthAdminService } from './admin/services/auth.service';
import { UserAdminService } from './admin/services/user.service';
import { ImagesService } from '@app/common/helpers/file.helpers';
import { AppController } from './user/controllers/app.controller';
import { DatabaseModule } from '@app/common/model/database.module';
import { UserController } from './user/controllers/user.controller';
import { AuthController } from './user/controllers/auth.controller';
import { RecordAdminService } from './admin/services/record.service';
import { LevelsAdminService } from './admin/services/levels.service';
import { ReportAdminService } from './admin/services/report.service';
import { ScoreAdminService } from './admin/services/scoring.service';
import { SchoolAdminService } from './admin/services/schools.service';
import { ResponseService } from '@app/common/response/response.service';
import { RecordController } from './user/controllers/record.controller';
import { LevelsController } from './user/controllers/levels.controller';
import { ScoreController } from './user/controllers/scoring.controller';
import { AnalysisAdminService } from './admin/services/analysis.service';
import { AuthAdminController } from './admin/controllers/auth.controller';
import { UserAdminController } from './admin/controllers/user.controller';
import { MongooseModulesImport } from '@app/common/model/database.service';
import { LevelsAdminController } from './admin/controllers/levels.controller';
import { ScoreAdminController } from './admin/controllers/scoring.controller';
import { RecordAdminController } from './admin/controllers/record.controller';
import { ReportAdminController } from './admin/controllers/report.controller';
import { SchoolAdminController } from './admin/controllers/schools.controller';
import { AnalysisAdminController } from './admin/controllers/analysis.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES') },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature(MongooseModulesImport),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..')
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    LevelsController,
    ScoreController,
    UserController,
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
    UserService,
    AnalysisAdminService,
    AuthAdminService,
    LevelsAdminService,
    RecordAdminService,
    ReportAdminService,
    SchoolAdminService,
    ScoreAdminService,
    UserAdminService,
    RecordService,
  ],
})
export class AppModule { }
