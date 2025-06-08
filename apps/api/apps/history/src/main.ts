import { NestFactory } from '@nestjs/core';
import { HistoryModule } from './history.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RabbitMqConfigService } from '@app/app-config/rabbitmq-config.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(HistoryModule);
  const configService = app.get(RabbitMqConfigService);
  const logger = new Logger('HistoryService');
  const queueName = 'save_history';
  const rmqConfig = configService.rabbitMqConsumerConfig(queueName);

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
