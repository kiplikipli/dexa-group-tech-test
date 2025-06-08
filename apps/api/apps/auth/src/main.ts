import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { TcpOptions } from '@nestjs/microservices';
import { AuthConfigService } from '../../../libs/app-config/src/auth-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const authConfigService = app.get(AuthConfigService);

  const config = authConfigService.authServiceConfig;
  app.connectMicroservice<TcpOptions>({
    transport: config.transport,
    options: {
      host: config.options?.host,
      port: config.options?.port,
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
