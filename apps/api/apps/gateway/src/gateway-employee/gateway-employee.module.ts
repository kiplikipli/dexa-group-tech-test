import { AppConfigModule } from '@app/app-config';
import { EmployeeConfigService } from '@app/app-config/employee-config.service';
import { UtilsModule } from '@app/utils';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AUTH_SERVICE, EMPLOYEE_SERVICE } from 'apps/gateway/constants';
import { GatewayEmployeeController } from './gateway-employee.controller';
import { AuthConfigService } from '@app/app-config/auth-config.service';

@Module({
  imports: [
    AppConfigModule,
    ClientsModule.registerAsync([
      {
        imports: [AppConfigModule],
        inject: [EmployeeConfigService],
        name: EMPLOYEE_SERVICE,
        useFactory: (employeeConfigService: EmployeeConfigService) =>
          employeeConfigService.employeeServiceConfig,
      },
      {
        imports: [AppConfigModule],
        inject: [AuthConfigService],
        name: AUTH_SERVICE,
        useFactory: (authConfigService: AuthConfigService) =>
          authConfigService.authServiceConfig,
      },
    ]),
    UtilsModule,
  ],
  controllers: [GatewayEmployeeController],
})
export class GatewayEmployeeModule {}
