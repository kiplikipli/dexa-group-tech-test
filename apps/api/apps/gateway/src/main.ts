import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { CommonService } from '@app/utils';
import { LoggingInterceptor, ResponseInterceptor } from '../interceptors';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const commonService = app.get(CommonService);
  app.useGlobalInterceptors(
    new ResponseInterceptor(commonService),
    new LoggingInterceptor(),
  );
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
