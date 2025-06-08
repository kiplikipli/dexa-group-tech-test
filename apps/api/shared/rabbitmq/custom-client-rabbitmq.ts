import { ClientRMQ } from '@nestjs/microservices';

export class CustomClientRMQ extends ClientRMQ {
  async customEmit<TData = any>(routingKey: string, data: TData) {
    await this.connect();

    const message = {
      pattern: routingKey,
      data,
    };

    this.channel.publish(
      this.options.exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
    );
  }
}
