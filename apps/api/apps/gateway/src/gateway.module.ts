import { Module } from '@nestjs/common';
import { GatewayAuthModule } from './gateway-auth/gateway-auth.module';
import { GatewayEmployeeModule } from './gateway-employee/gateway-employee.module';
import { GatewayAttendanceModule } from './gateway-attendance/gateway-attendance.module';

@Module({
  imports: [GatewayAttendanceModule, GatewayAuthModule, GatewayEmployeeModule],
})
export class GatewayModule {}
