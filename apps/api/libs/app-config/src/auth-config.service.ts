import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TcpClientOptions, Transport } from '@nestjs/microservices';
import { AppConfigService } from './app-config.service';

@Injectable()
export class AuthConfigService extends AppConfigService {
  constructor(protected configService: ConfigService) {
    super(configService);
  }

  get authServiceConfig(): TcpClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        host: this.getString('AUTH_SERVICE_HOST'),
        port: this.getNumber('AUTH_SERVICE_PORT'),
      },
    };
  }

  get defaultUserPassword(): string {
    return this.getString('AUTH_SERVICE_DEFAULT_USER_PASSWORD');
  }
}
