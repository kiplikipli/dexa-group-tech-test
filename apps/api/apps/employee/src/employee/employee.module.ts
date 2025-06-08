import { UtilsModule } from '@app/utils';
import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { FirebaseModule } from '@app/firebase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { AppConfigModule } from '@app/app-config';
import { RabbitMqConfigService } from '@app/app-config/rabbitmq-config.service';
import { CustomClientRMQ } from 'shared/rabbitmq/custom-client-rabbitmq';
import { ClientsModule } from '@nestjs/microservices';
import { AuthConfigService } from '@app/app-config/auth-config.service';
import { AUTH_SERVICE } from 'apps/gateway/constants';

@Module({
  imports: [
    AppConfigModule,
    ClientsModule.registerAsync([
      {
        imports: [AppConfigModule],
        inject: [AuthConfigService],
        name: AUTH_SERVICE,
        useFactory: (authConfigService: AuthConfigService) =>
          authConfigService.authServiceConfig,
      },
    ]),
    FirebaseModule,
    TypeOrmModule.forFeature([Employee]),
    UtilsModule,
  ],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    {
      provide: 'RABBITMQ_CLIENT',
      inject: [RabbitMqConfigService],
      useFactory: (configService: RabbitMqConfigService) => {
        const { options } = configService.rabbitMqProducerConfig();
        return new CustomClientRMQ({
          urls: options?.urls,
          exchange: options?.exchange,
          exchangeType: options?.exchangeType,
        });
      },
    },
  ],
  exports: [EmployeeService],
})
export class EmployeeModule {}
