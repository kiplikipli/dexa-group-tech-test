import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config.service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export type DatabaseType = 'mysql' | 'postgres' | 'mariadb' | 'sqlite';

@Injectable()
export class TypeOrmHistoryConfigService extends AppConfigService {
  constructor(protected configService: ConfigService) {
    super(configService);
  }

  get dbHistoryConfig(): TypeOrmModuleOptions {
    const type = this.getString('HISTORY_SERVICE_DB_TYPE');

    return {
      type: type as DatabaseType,
      host: this.getString('HISTORY_SERVICE_DB_HOST'),
      port: this.getNumber('HISTORY_SERVICE_DB_PORT'),
      username: this.getString('HISTORY_SERVICE_DB_USERNAME'),
      password: this.getString('HISTORY_SERVICE_DB_PASSWORD'),
      database: this.getString('HISTORY_SERVICE_DB_DATABASE'),
    };
  }
}
