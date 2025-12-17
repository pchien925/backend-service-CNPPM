import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './configs/swagger.config';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './exception/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  setupSwagger(app);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map(error => ({
            field: error.property,
            error: error.constraints
              ? Object.values(error.constraints).join(', ')
              : 'Invalid value',
          })),
        );
      },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server is running on port: ${process.env.PORT}`);
}
bootstrap();
