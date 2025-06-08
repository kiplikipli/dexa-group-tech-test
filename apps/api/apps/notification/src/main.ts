import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { RabbitMqConfigService } from '@app/app-config/rabbitmq-config.service';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  const configService = app.get(RabbitMqConfigService);
  const queueName = 'admin_notification';
  const rmqConfig = configService.rabbitMqConsumerConfig(queueName);
  const logger = new Logger('NotificationService');

  app.connectMicroservice<MicroserviceOptions>(rmqConfig);

  await app.startAllMicroservices();
  logger.log(
    `Connected to RabbitMQ: ${JSON.stringify({
      exchange: rmqConfig.options?.exchange,
      queue: queueName,
    })}`,
  );
}

bootstrap();
