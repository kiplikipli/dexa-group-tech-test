import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TcpClientOptions, Transport } from '@nestjs/microservices';
import { AppConfigService } from './app-config.service';

@Injectable()
export class EmployeeConfigService extends AppConfigService {
  constructor(protected configService: ConfigService) {
    super(configService);
  }

  get employeeServiceConfig(): TcpClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        host: this.getString('EMPLOYEE_SERVICE_HOST'),
        port: this.getNumber('EMPLOYEE_SERVICE_PORT'),
      },
    };
  }
}
