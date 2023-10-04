import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '@app/common/model/database.module';
import { MongooseModulesImport } from '@app/common/model/database.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AnalysisController } from './controllers/analysis.controller';
import { AnalysisService } from './services/analysis.service';
import { ReportController } from './controllers/report.controller';
import { ReportService } from './services/report.service';
import { ScoreController } from './controllers/scoring.controller';
import { ScoreService } from './services/scoring.service';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

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
  ],
  controllers: [
    AuthController,
    AnalysisController,
    ReportController,
    ScoreController,
    UserController,
  ],
  providers: [
    AuthService,
    AnalysisService,
    ReportService,
    ScoreService,
    UserService,
  ],
})

export class AppModule { }
