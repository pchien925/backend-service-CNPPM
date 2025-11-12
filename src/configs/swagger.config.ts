import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('BACKEND SERVICE CNPMM')
    .setDescription('API documentation for backend service cnpmm project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger-ui.html', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'NestJS Practice Docs',
  });
}
