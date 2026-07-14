import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3001;

  // Prefijo global para versionado de API
  app.setGlobalPrefix('api/v1');

  // CORS habilitado para que el frontend pueda consumir
  app.enableCors();

  // Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // OpenAPI / Swagger
  const config = new DocumentBuilder()
    .setTitle('NextTicket API')
    .setDescription('API de gestión y venta de boletos para eventos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  type NestApp = Parameters<typeof SwaggerModule.createDocument>[0];
  const nestApp = app as NestApp;

  const document = SwaggerModule.createDocument(nestApp, config);
  SwaggerModule.setup('api', nestApp, document);

  // Scalar docs
  app.use(
    '/docs',
    apiReference({
      content: document,
    }),
  );

  await app.listen(port);
  console.log(`NextTicket API escuchando en http://localhost:${port}`);
  console.log(`Scalar docs en http://localhost:${port}/docs`);
  console.log(`Swagger UI en http://localhost:${port}/api`);
  console.log(`OpenAPI JSON en http://localhost:${port}/api-json`);
}
bootstrap();