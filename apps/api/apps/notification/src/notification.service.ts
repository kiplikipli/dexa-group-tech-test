import { FirebaseNotificationRepository } from '@app/firebase/firebase-notification.repository';
import { Injectable, Logger } from '@nestjs/common';
import { TPayloadEmployeeUpdatedEvent } from 'apps/employee/src/employee/types/events';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  constructor(
    private readonly firebaseNotificationRepository: FirebaseNotificationRepository,
  ) {}

  async sendNotification(
    payload: TPayloadEmployeeUpdatedEvent,
  ): Promise<string> {
    this.logger.log('consuming message from admin_notification queue');
    this.logger.log(`payload: ${JSON.stringify(payload)}`);
    await this.firebaseNotificationRepository.storeUpdatedEmployeeNotification(
      payload.newEmployee.email,
    );
    return 'notification sent';
  }
}
