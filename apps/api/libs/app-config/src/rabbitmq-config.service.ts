import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from './app-config.service';
import { RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RabbitMqConfigService extends AppConfigService {
  constructor(protected configService: ConfigService) {
    super(configService);
  }

  rabbitMqProducerConfig(): RmqOptions {
    const rabbitMqHost = this.getString('RABBITMQ_HOST');
    return {
      transport: Transport.RMQ,
      options: {
        urls: [
          {
            hostname: rabbitMqHost,
            port: this.getNumber('RABBITMQ_PORT'),
            username: this.getString('RABBITMQ_USERNAME'),
            password: this.getString('RABBITMQ_PASSWORD'),
          },
        ],
        exchange: this.getString('RABBITMQ_EXCHANGE'),
        exchangeType: 'fanout',
      },
    };
  }

  rabbitMqConsumerConfig(queue: string): RmqOptions {
    const rabbitMqHost = this.getString('RABBITMQ_HOST');
    return {
      transport: Transport.RMQ,
      options: {
        urls: [
          {
            hostname: rabbitMqHost,
            port: this.getNumber('RABBITMQ_PORT'),
            username: this.getString('RABBITMQ_USERNAME'),
            password: this.getString('RABBITMQ_PASSWORD'),
          },
        ],
        exchange: this.getString('RABBITMQ_EXCHANGE'),
        exchangeType: 'fanout',
        queue,
        queueOptions: { durable: true },
      },
    };
  }
}
