import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    optionsSuccessStatus: 200,
    credentials: true
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const options = new DocumentBuilder()
    .setTitle('Educational Game API')
    .setDescription('API for educational games')
    .setContact('Iwan Suryaningrat', 'https://iwansuryaningrat.tech', 'iwan.suryaningrat28@gmail.com')
    .addServer('localhost:3000', "Local Server",)
    .addServer('https:game-api.iwansuryaningrat.tech', "Production Server",)
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http', scheme: 'bearer', bearerFormat: 'token', in: 'header'
    }, 'Authorization')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  const setupOptions: SwaggerCustomOptions = {
    explorer: true,
    customfavIcon: 'https://res.cloudinary.com/sningratt/image/upload/v1705343945/favicon/gnikhbhcm4sdxwdo3bl3.ico',
    customSiteTitle: "Educational Game API Documentation",
    url: "/docs",
    jsonDocumentUrl: "/docs/json",
    yamlDocumentUrl: "/docs/yaml",
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
      deepLinking: true,
      displayOperationId: false,
      syntaxHighlight: {
        activate: true,
        theme: 'obsidian',
      },
    },
  };

  SwaggerModule.setup('docs', app, document, setupOptions);

  await app.listen(3000);
}
bootstrap();
