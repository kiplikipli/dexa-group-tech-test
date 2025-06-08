import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from './app-config.service';
import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

@Injectable()
export class TimezoneConfigService extends AppConfigService {
  constructor(protected configService: ConfigService) {
    super(configService);
    dayjs.extend(utc);
    dayjs.extend(timezone);
  }

  get systemTimezone() {
    const systemTimezone = this.getString('SYSTEM_TIMEZONE');
    // try system timezone to validate the timezone
    dayjs().tz(systemTimezone);
    return systemTimezone;
  }
}
