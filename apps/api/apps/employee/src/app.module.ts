import { AppConfigModule } from '@app/app-config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from './employee/employee.module';
import { TypeOrmEmployeeConfigService } from '@app/app-config/typeorm/typeorm-employee-config.service';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    AppConfigModule,
    AttendanceModule,
    EmployeeModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [TypeOrmEmployeeConfigService],
      useFactory: (configService: TypeOrmEmployeeConfigService) => {
        return {
          ...configService.dbEmployeeConfig,
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class AppModule {}
