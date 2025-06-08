import { Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { ConfigModule } from '@nestjs/config';
import { AuthConfigService } from './auth-config.service';
import { JwtConfigService } from './jwt-config.service';
import { EmployeeConfigService } from './employee-config.service';
import { TypeOrmAuthConfigService } from './typeorm/typeorm-auth-config.service';
import { TypeOrmEmployeeConfigService } from './typeorm/typeorm-employee-config.service';
import { RabbitMqConfigService } from './rabbitmq-config.service';
import { ApiKeyConfigService } from './api-key-config.service';
import { TimezoneConfigService } from './timezone-config.service';
import { TypeOrmHistoryConfigService } from './typeorm/typeorm-history-config.service';

const providers = [
  ApiKeyConfigService,
  AppConfigService,
  AuthConfigService,
  EmployeeConfigService,
  JwtConfigService,
  RabbitMqConfigService,
  TimezoneConfigService,
  TypeOrmAuthConfigService,
  TypeOrmEmployeeConfigService,
  TypeOrmHistoryConfigService,
];

@Module({
  imports: [ConfigModule.forRoot()],
  providers,
  exports: providers,
})
export class AppConfigModule {}
