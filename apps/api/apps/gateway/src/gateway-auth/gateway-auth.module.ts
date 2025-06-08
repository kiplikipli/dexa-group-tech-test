import { AppConfigModule } from '@app/app-config';
import { AuthConfigService } from '@app/app-config/auth-config.service';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AUTH_SERVICE, EMPLOYEE_SERVICE } from 'apps/gateway/constants';
import { GatewayAuthController } from './gateway-auth.controller';
import { UtilsModule } from '@app/utils';
import { EmployeeConfigService } from '@app/app-config/employee-config.service';

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
      {
        imports: [AppConfigModule],
        inject: [EmployeeConfigService],
        name: EMPLOYEE_SERVICE,
        useFactory: (employeeConfigService: EmployeeConfigService) =>
          employeeConfigService.employeeServiceConfig,
      },
    ]),
    UtilsModule,
  ],
  controllers: [GatewayAuthController],
})
export class GatewayAuthModule {}
