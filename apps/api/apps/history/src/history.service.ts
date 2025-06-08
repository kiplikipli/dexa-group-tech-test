import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TPayloadEmployeeUpdatedEvent } from 'apps/employee/src/employee/types/events';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { CommonService } from '@app/utils';

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    private readonly commonService: CommonService,
  ) {}

  async saveHistories(payload: TPayloadEmployeeUpdatedEvent): Promise<History> {
    this.logger.log('saving history to database with payload:');
    this.logger.log(JSON.stringify(payload));

    const savePayload = {
      employeeId: payload.newEmployee.id,
      oldEmployee: this.commonService.omitObject(payload.oldEmployee, [
        'id',
        'createdAt',
        'updatedAt',
      ]),
      newEmployee: this.commonService.omitObject(payload.newEmployee, [
        'id',
        'createdAt',
        'updatedAt',
      ]),
      createdBy: payload.authorizedUser.userId,
    };

    const history = await this.historyRepository.save(savePayload);

    return history;
  }
}
