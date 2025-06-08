import { CommonService } from '@app/utils';
import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Attendance } from 'apps/employee/src/attendance/entities/attendance.entity';
import { EMPLOYEE_SERVICE } from 'apps/gateway/constants';
import { AuthenticatedGuard } from 'apps/gateway/guards';
import { Request } from 'express';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';
import { TSuccessResponse } from 'types/gateway';
import { TAuthorizedUserRequest } from 'types/services/request';

@UseGuards(AuthenticatedGuard)
@Controller('attendances')
export class GatewayAttendanceController {
  private readonly logger: Logger = new Logger(
    GatewayAttendanceController.name,
  );
  constructor(
    @Inject(EMPLOYEE_SERVICE) private client: ClientProxy,
    private readonly commonService: CommonService,
  ) {}

  @Get()
  async getAttendances(
    @Req() req: Request,
    @Query() dto: FilterAttendanceDto,
  ): Promise<Attendance[]> {
    const authorizedUser = req['user'];
    const payload = this.commonService.injectApiKey({
      authorizedUser,
      employeeId: dto.employeeId,
      checkInTime:
        dto.checkInTimeFrom && dto.checkInTimeTo
          ? {
              from: dto.checkInTimeFrom,
              to: dto.checkInTimeTo,
            }
          : undefined,
      checkOutDate:
        dto.checkOutTimeFrom && dto.checkOutTimeTo
          ? {
              from: dto.checkOutTimeFrom,
              to: dto.checkOutTimeTo,
            }
          : undefined,
      totalWorkingSeconds:
        dto.totalWorkingSecondsMin && dto.totalWorkingSecondsMax
          ? {
              min: dto.totalWorkingSecondsMin,
              max: dto.totalWorkingSecondsMax,
            }
          : undefined,
      limit: dto.limit || 10,
      offset: dto.offset || 0,
    });

    this.logger.log(
      `calling attendance service > findAttendances with payload:`,
    );
    this.logger.log(JSON.stringify(payload));
    const response = await this.commonService.processObservable<
      TSuccessResponse<Attendance[]>
    >(this.client.send('attendance.findAttendances', payload));

    return response.data;
  }

  @Post('check-in')
  async checkIn(@Req() req: Request) {
    const authorizedUser: TAuthorizedUserRequest = req['user'];
    if (!authorizedUser || this.commonService.isEmptyObject(authorizedUser)) {
      throw new UnauthorizedException();
    }

    const payload = this.commonService.injectApiKey({
      userId: authorizedUser.userId,
    });
    this.logger.log(`calling attendance service > checkIn with payload:`);
    this.logger.log(JSON.stringify(payload));
    const response = await this.commonService.processObservable<
      TSuccessResponse<Attendance>
    >(this.client.send('attendance.checkIn', payload));

    return response.data;
  }

  @Post('check-out')
  async checkOut(@Req() req: Request) {
    const authorizedUser: TAuthorizedUserRequest = req['user'];
    if (!authorizedUser || this.commonService.isEmptyObject(authorizedUser)) {
      throw new UnauthorizedException();
    }

    const payload = this.commonService.injectApiKey({
      userId: authorizedUser.userId,
    });
    this.logger.log(`calling attendance service > checkOut with payload:`);
    this.logger.log(JSON.stringify(payload));
    const response = await this.commonService.processObservable<
      TSuccessResponse<Attendance>
    >(this.client.send('attendance.checkOut', payload));

    return response.data;
  }
}
