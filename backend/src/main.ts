import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. UPDATED CORS: Allow localhost AND production frontend, filtering out undefined values
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    methods: [
      'GET',
      'HEAD',
      'PUT',
      'PATCH',
      'POST',
      'DELETE',
      'OPTIONS',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('EN2H Booking Platform API')
    .setDescription('Booking management REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 2. UPDATED PORT: Listen to Render's port, or fallback to 5000 locally
  await app.listen(process.env.PORT || 5000);
}

bootstrap();