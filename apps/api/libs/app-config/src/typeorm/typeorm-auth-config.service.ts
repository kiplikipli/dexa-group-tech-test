import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config.service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export type DatabaseType = 'mysql' | 'postgres' | 'mariadb' | 'sqlite';

@Injectable()
export class TypeOrmAuthConfigService extends AppConfigService {
  constructor(protected configService: ConfigService) {
    super(configService);
  }

  get dbAuthConfig(): TypeOrmModuleOptions {
    const type = this.getString('AUTH_SERVICE_DB_TYPE');

    return {
      type: type as DatabaseType,
      host: this.getString('AUTH_SERVICE_DB_HOST'),
      port: this.getNumber('AUTH_SERVICE_DB_PORT'),
      username: this.getString('AUTH_SERVICE_DB_USERNAME'),
      password: this.getString('AUTH_SERVICE_DB_PASSWORD'),
      database: this.getString('AUTH_SERVICE_DB_DATABASE'),
    };
  }
}
