import { Module } from '@nestjs/common';
import { GatewayAttendanceController } from './gateway-attendance.controller';
import { ClientsModule } from '@nestjs/microservices';
import { AppConfigModule } from '@app/app-config';
import { EmployeeConfigService } from '@app/app-config/employee-config.service';
import { AUTH_SERVICE, EMPLOYEE_SERVICE } from 'apps/gateway/constants';
import { AuthConfigService } from '@app/app-config/auth-config.service';
import { UtilsModule } from '@app/utils';

@Module({
  imports: [
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
  controllers: [GatewayAttendanceController],
})
export class GatewayAttendanceModule {}
