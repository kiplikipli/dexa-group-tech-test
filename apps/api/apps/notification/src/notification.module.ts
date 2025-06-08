import { FirebaseModule } from '@app/firebase/firebase.module';
import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { AppConfigModule } from '@app/app-config';

@Module({
  imports: [AppConfigModule, FirebaseModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
