import { Module } from "@nestjs/common";
import { CommonService } from "./common.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DatabaseModule } from "./model/database.module";
import { MongooseModule } from "@nestjs/mongoose";
import { MongooseModulesImport } from "./model/database.service";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

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
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
