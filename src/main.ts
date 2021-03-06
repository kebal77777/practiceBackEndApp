import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as Express from 'express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ServerExceptionFilter } from './filters/server-exception.filter';

const server = Express();
const PORT = process.env.PORT || 4001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    cors: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(
    new ServerExceptionFilter(),
    new HttpExceptionFilter(),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nestjs Demo Project')
    .setDescription(
      'This is the demo project of nestjs for learning Typescript and awesome NestJs',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Token',
      },
      'Authorization',
    )
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('index.html', app, swaggerDoc);

  await app.listen(PORT, () => {
    console.log(`Server is listing up ${PORT} on ${new Date()}`);
  });
}
bootstrap();
