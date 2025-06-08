import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config.service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export type DatabaseType = 'mysql' | 'postgres' | 'mariadb' | 'sqlite';

@Injectable()
export class TypeOrmEmployeeConfigService extends AppConfigService {
  constructor(protected configService: ConfigService) {
    super(configService);
  }

  get dbEmployeeConfig(): TypeOrmModuleOptions {
    const type = this.getString('EMPLOYEE_SERVICE_DB_TYPE');

    return {
      type: type as DatabaseType,
      host: this.getString('EMPLOYEE_SERVICE_DB_HOST'),
      port: this.getNumber('EMPLOYEE_SERVICE_DB_PORT'),
      username: this.getString('EMPLOYEE_SERVICE_DB_USERNAME'),
      password: this.getString('EMPLOYEE_SERVICE_DB_PASSWORD'),
      database: this.getString('EMPLOYEE_SERVICE_DB_DATABASE'),
    };
  }
}
