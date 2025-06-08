import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('employee.updated')
  async getHello(@Payload() payload: any): Promise<string> {
    return await this.notificationService.sendNotification(payload);
  }
}
