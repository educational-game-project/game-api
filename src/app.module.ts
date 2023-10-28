import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '@app/common/model/database.module';
import { MongooseModulesImport } from '@app/common/model/database.service';
import { ResponseService } from '@app/common/response/response.service';
import { AuthController } from './user/controllers/auth.controller';
import { AuthService } from './user/services/auth.service';
import { AnalysisController } from './user/controllers/analysis.controller';
import { AnalysisService } from './user/services/analysis.service';
import { ReportController } from './user/controllers/report.controller';
import { ReportService } from './user/services/report.service';
import { ScoreController } from './user/controllers/scoring.controller';
import { ScoreService } from './user/services/scoring.service';
import { UserController } from './user/controllers/user.controller';
import { UserService } from './user/services/user.service';
import { LevelsController } from './user/controllers/levels.controller';
import { LevelsService } from './user/services/levels.service';
import { AppController } from './user/controllers/app.controller';
import { AppService } from './user/services/app.service';
import { AnalysisAdminController } from './admin/controllers/analysis.controller';
import { AnalysisAdminService } from './admin/services/analysis.service';
import { AuthAdminController } from './admin/controllers/auth.controller';
import { AuthAdminService } from './admin/services/auth.service';
import { LevelsAdminController } from './admin/controllers/levels.controller';
import { LevelsAdminService } from './admin/services/levels.service';
import { RecordAdminController } from './admin/controllers/record.controller';
import { RecordAdminService } from './admin/services/record.service';
import { ReportAdminController } from './admin/controllers/report.controller';
import { ReportAdminService } from './admin/services/report.service';
import { SchoolAdminController } from './admin/controllers/schools.controller';
import { SchoolAdminService } from './admin/services/schools.service';
import { ScoreAdminController } from './admin/controllers/scoring.controller';
import { ScoreAdminService } from './admin/services/scoring.service';
import { UserAdminController } from './admin/controllers/user.controller';
import { UserAdminService } from './admin/services/user.service';
import { ImagesService } from '@app/common/helpers/file.helpers';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_KEY'),
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
    AnalysisController,
    LevelsController,
    ReportController,
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
  ],
  providers: [
    ImagesService,
    ResponseService,
    AppService,
    AuthService,
    AnalysisService,
    LevelsService,
    ReportService,
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
  ],
})
export class AppModule { }
