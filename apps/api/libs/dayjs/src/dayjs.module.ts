import { Module } from '@nestjs/common';
import { DayjsService } from './dayjs.service';
import { AppConfigModule } from '@app/app-config';

@Module({
  imports: [AppConfigModule],
  providers: [DayjsService],
  exports: [DayjsService],
})
export class DayjsModule {}
