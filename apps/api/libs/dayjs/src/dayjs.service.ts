import { TimezoneConfigService } from '@app/app-config/timezone-config.service';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

@Injectable()
export class DayjsService {
  constructor(private readonly timezoneConfigService: TimezoneConfigService) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
  }

  fromDateString(dateString: string): dayjs.Dayjs {
    return dayjs(dateString).tz(this.timezoneConfigService.systemTimezone);
  }

  isDayjs(date: any): boolean {
    return dayjs.isDayjs(date);
  }

  getCurrentDate(tz?: string): dayjs.Dayjs {
    const localTime = dayjs();
    if (tz) {
      return localTime.tz(tz);
    }

    return localTime.tz(this.timezoneConfigService.systemTimezone);
  }

  getTodayStartDate(tz?: string): dayjs.Dayjs {
    const localTime = dayjs();
    if (tz) {
      return localTime.startOf('day').tz(tz);
    }

    return localTime
      .startOf('day')
      .tz(this.timezoneConfigService.systemTimezone);
  }

  getTodayEndDate(tz?: string): dayjs.Dayjs {
    const localTime = dayjs();
    if (tz) {
      return localTime.endOf('day').tz(tz);
    }

    return localTime.endOf('day').tz(this.timezoneConfigService.systemTimezone);
  }

  getDateDiff(
    date1: dayjs.Dayjs,
    date2: dayjs.Dayjs,
    type: dayjs.QUnitType,
  ): number {
    return date1.diff(date2, type);
  }
}
