import {
  Controller,
  ForbiddenException,
  Logger,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AttendanceService } from './attendance.service';
import { ResponseInterceptor } from 'shared/interceptors/response.interceptor';
import { LoggingInterceptor } from 'shared/interceptors/logging.interceptor';
import { DayjsService } from '@app/dayjs';
import { CommonService } from '@app/utils';

@UseInterceptors(ResponseInterceptor, LoggingInterceptor)
@Controller('attendances')
export class AttendanceController {
  private readonly logger = new Logger(AttendanceController.name);
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly dayjsService: DayjsService,
    private readonly commonService: CommonService,
  ) {}

  @MessagePattern('attendance.findAttendances')
  async findAttendances(@Payload() payload: Record<string, any>) {
    this.logger.log('processing findAttendances with payload:');
    this.logger.log(JSON.stringify(payload));
    const authorizedUser = payload.authorizedUser;
    if (
      !authorizedUser ||
      this.commonService.isEmptyObject(authorizedUser as Record<string, any>)
    ) {
      throw new UnauthorizedException();
    }

    if (!payload.employeeId) {
      payload['employeeId'] = authorizedUser.employeeId;
    }

    if (
      parseInt(payload.employeeId) !== parseInt(authorizedUser.employeeId) &&
      authorizedUser.role !== 'admin'
    ) {
      throw new ForbiddenException();
    }

    const filters = {
      employeeId: payload.employeeId,
      checkInTime: payload.checkInTime
        ? {
            from: this.dayjsService.isDayjs(payload.checkInTime.from)
              ? payload.checkInTime.from
              : this.dayjsService.fromDateString(payload.checkInTime.from),
            to: this.dayjsService.isDayjs(payload.checkInTime.to)
              ? payload.checkInTime.to
              : this.dayjsService.fromDateString(payload.checkInTime.to),
          }
        : {
            from: this.dayjsService.getTodayStartDate(),
            to: this.dayjsService.getTodayEndDate(),
          },
      checkOutTime: payload.checkOutTime
        ? {
            from: this.dayjsService.isDayjs(payload.checkoutTime.from)
              ? payload.checkoutTime.from
              : this.dayjsService.fromDateString(payload.checkoutTime.from),
            to: this.dayjsService.isDayjs(payload.checkoutTime.to)
              ? payload.checkoutTime.to
              : this.dayjsService.fromDateString(payload.checkoutTime.to),
          }
        : undefined,
      totalWorkingSeconds: payload.totalWorkingSeconds,
      limit: payload.limit,
      offset: payload.offset,
    };

    const attendances = await this.attendanceService.findAttendances(filters);
    return attendances;
  }

  @MessagePattern('attendance.checkIn')
  async checkIn(@Payload() payload: Record<string, any>) {
    this.logger.log('processing checkIn with payload:');
    this.logger.log(JSON.stringify(payload));
    const parsedPayload = {
      userId: payload.userId,
    };

    return await this.attendanceService.checkIn(parsedPayload);
  }

  @MessagePattern('attendance.checkOut')
  async checkOut(@Payload() payload: Record<string, any>) {
    this.logger.log('processing checkIn with payload:');
    this.logger.log(JSON.stringify(payload));
    const parsedPayload = {
      userId: payload.userId,
    };

    return await this.attendanceService.checkOut(parsedPayload);
  }
}
