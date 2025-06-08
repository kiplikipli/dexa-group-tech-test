import { NestFactory } from '@nestjs/core';
import { EmployeeConfigService } from '@app/app-config/employee-config.service';
import { TcpOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const employeeConfigService = app.get(EmployeeConfigService);

  const config = employeeConfigService.employeeServiceConfig;
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
