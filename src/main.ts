import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Response } from './common/response';
import { HttpFilter } from './common/filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import * as cors from 'cors';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.setGlobalPrefix('blogapi');
  app.useGlobalInterceptors(new Response());
  app.useGlobalFilters(new HttpFilter());
  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('blog接口文档')
    .setDescription('个人博客接口文档')
    .setVersion('1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document);
  await app.listen(3000);
}
bootstrap();
