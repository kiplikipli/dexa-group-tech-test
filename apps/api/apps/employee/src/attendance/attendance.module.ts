import { Module } from '@nestjs/common';
import { Attendance } from './entities/attendance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { UtilsModule } from '@app/utils';
import { DayjsModule } from '@app/dayjs';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [
    DayjsModule,
    EmployeeModule,
    TypeOrmModule.forFeature([Attendance]),
    UtilsModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
