import { Controller, Logger } from '@nestjs/common';
import { HistoryService } from './history.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TPayloadEmployeeUpdatedEvent } from 'apps/employee/src/employee/types/events';

@Controller()
export class HistoryController {
  private readonly logger = new Logger(HistoryController.name);
  constructor(private readonly historyService: HistoryService) {}

  @EventPattern('employee.updated')
  async getHello(
    @Payload() payload: TPayloadEmployeeUpdatedEvent,
  ): Promise<void> {
    this.logger.log('consuming message from save_history queue');
    this.logger.log(`payload: ${JSON.stringify(payload)}`);

    const history = await this.historyService.saveHistories(payload);
    this.logger.log(`successfully stored history`);
    this.logger.log(JSON.stringify(history));

    return;
  }
}
