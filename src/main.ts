import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CustomResponseInterceptor } from './core/https/response';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Set Prefix api
  app.setGlobalPrefix('api');

  // Apply global interceptor
  app.useGlobalInterceptors(new CustomResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Sports Booking App')
    .setDescription('API description for sports booking application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Swagger documentation is available at http://localhost:${port}/api-docs`);
  });
}
bootstrap();
