import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { TFindAttendancesFilter } from './types/find-attendances-filter.type';
import { Between, Repository } from 'typeorm';
import { CommonService } from '@app/utils';
import { DayjsService } from '@app/dayjs';
import { TCheckInPayload } from './types/check-in-payload.type';
import { EmployeeService } from '../employee/employee.service';
import { TCheckOutPayload } from './types/check-out-payload.type';

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    private readonly commonService: CommonService,
    private readonly dayjsService: DayjsService,
    private readonly employeeService: EmployeeService,
  ) {}

  async findAttendances(
    filters: TFindAttendancesFilter,
  ): Promise<Attendance[]> {
    const whereQuery = {};

    if (filters.id) {
      whereQuery['id'] = filters.id;
    }

    if (filters.employeeId) {
      whereQuery['employee'] = {
        id: filters.employeeId,
      };
    }

    if (
      filters.checkInTime &&
      !this.commonService.isEmptyObject(filters.checkInTime)
    ) {
      const fromDate = filters.checkInTime.from;
      const toDate = filters.checkInTime.to;

      const betweenDates = Between(
        fromDate.toISOString(),
        toDate.toISOString(),
      );
      whereQuery['checkInTime'] = betweenDates;
    }

    if (
      filters.checkOutTime &&
      !this.commonService.isEmptyObject(filters.checkOutTime)
    ) {
      const fromDate = filters.checkOutTime.from;
      const toDate = filters.checkOutTime.to;

      const betweenDates = Between(
        fromDate.toISOString(),
        toDate.toISOString(),
      );
      whereQuery['checkOutTime'] = betweenDates;
    }

    if (
      filters.totalWorkingSeconds &&
      !this.commonService.isEmptyObject(filters.totalWorkingSeconds)
    ) {
      const min = filters.totalWorkingSeconds.min;
      const max = filters.totalWorkingSeconds.max;
      whereQuery['totalWorkingSeconds'] = Between(min, max);
    }

    const attendances = await this.attendanceRepository.find({
      where: whereQuery,
      relations: {
        employee: true,
      },
      take: filters.limit,
      skip: filters.offset,
    });

    return attendances;
  }

  async findOneAttendance(
    filters: TFindAttendancesFilter,
  ): Promise<Attendance | null> {
    const attendances = await this.findAttendances({
      ...filters,
      limit: 1,
    });

    return attendances[0] || null;
  }

  async checkIn(payload: TCheckInPayload): Promise<Attendance> {
    const now = this.dayjsService.getCurrentDate();

    const employee = await this.employeeService.findById(payload.employeeId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const todayAttendance = await this.findOneAttendance({
      employeeId: employee.id,
      checkInTime: {
        from: this.dayjsService.getTodayStartDate(),
        to: this.dayjsService.getTodayEndDate(),
      },
    });

    if (todayAttendance) {
      throw new UnprocessableEntityException('Already check in');
    }

    const savePayload = {
      employee: {
        id: employee.id,
      },
      checkInTime: now.toISOString(),
    };
    this.logger.log(`saving attendance with payload:`);
    this.logger.log(JSON.stringify(savePayload));
    const attendance = await this.attendanceRepository.save(savePayload);

    return attendance;
  }

  async checkOut(payload: TCheckOutPayload): Promise<Attendance> {
    const now = this.dayjsService.getCurrentDate();

    const employee = await this.employeeService.findById(payload.employeeId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const todayAttendance = await this.findOneAttendance({
      employeeId: employee.id,
      checkInTime: {
        from: this.dayjsService.getTodayStartDate(),
        to: this.dayjsService.getTodayEndDate(),
      },
    });

    if (!todayAttendance) {
      throw new UnprocessableEntityException('Please check in first');
    }

    if (todayAttendance.checkOutTime) {
      throw new UnprocessableEntityException('Already check out');
    }

    const totalWorkingSeconds = this.dayjsService.getDateDiff(
      now,
      this.dayjsService.fromDateString(todayAttendance.checkInTime),
      'seconds',
    );

    const savePayload = {
      employee: {
        id: employee.id,
      },
      checkOutTime: now.toISOString(),
      totalWorkingSeconds,
    };
    this.logger.log(`saving attendance with payload:`);
    this.logger.log(JSON.stringify(savePayload));
    await this.attendanceRepository.update(
      {
        id: todayAttendance.id,
      },
      savePayload,
    );

    const updatedAttendance = await this.findOneAttendance({
      id: todayAttendance.id,
    });
    if (!updatedAttendance) {
      throw new Error('Attendance not found after updating');
    }

    return updatedAttendance;
  }
}
