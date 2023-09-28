import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ReportModule } from './report/report.module';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
  imports: [AuthModule, UserModule, ReportModule, AnalysisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
