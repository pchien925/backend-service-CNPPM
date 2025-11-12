import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './configs/swagger.config';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map(error => ({
            field: error.property,
            error: Object.values(error.constraints).join(', '),
          })),
        );
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server is running on port: ${process.env.PORT}`);
}
bootstrap();
