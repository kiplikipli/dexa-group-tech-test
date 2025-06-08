import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { TAuthorizedUserRequest } from 'types/services/request/authorized-user-request.type';
import { CustomClientRMQ } from 'shared/rabbitmq/custom-client-rabbitmq';
import { TPayloadEmployeeUpdatedEvent } from './types/events';
import { AUTH_SERVICE } from 'apps/gateway/constants';
import { ClientProxy } from '@nestjs/microservices';
import { CommonService } from '@app/utils';
import { TCreatedUserEmployeeResponse } from 'apps/auth/src/types/created-user-employee-response.type';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name);
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @Inject('RABBITMQ_CLIENT') private readonly rabbitmqClient: CustomClientRMQ,
    private dataSource: DataSource,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly commonService: CommonService,
  ) {}

  async getEmployees(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  async findById(id: number): Promise<Employee | null> {
    return this.employeeRepository.findOne({ where: { id } });
  }

  async findByUserId(userId: number): Promise<Employee | null> {
    return this.employeeRepository.findOne({ where: { userId: userId } });
  }

  async updateEmployee(
    id: number,
    update: any,
    authorizedUser: TAuthorizedUserRequest,
  ): Promise<Employee> {
    this.logger.log(
      `${JSON.stringify(authorizedUser)} is updating employee ${id}`,
    );
    const employee = await this.findById(id);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (
      employee.userId !== authorizedUser.userId &&
      authorizedUser.role !== 'admin'
    ) {
      throw new ForbiddenException();
    }

    const updatedData = {
      name: update.name,
      email: update.email,
      phone: update.phone,
      job_title: update.job_title,
    };

    await this.employeeRepository.update(id, updatedData);

    const updatedEmployee = await this.findById(id);
    if (!updatedEmployee) {
      throw new Error('Employee not found after updating');
    }

    await this.rabbitmqClient.customEmit<TPayloadEmployeeUpdatedEvent>(
      'employee.updated',
      {
        authorizedUser,
        oldEmployee: employee,
        newEmployee: updatedEmployee,
      },
    );

    return updatedEmployee;
  }

  async createEmployee(
    payload: Record<string, any>,
    authorizedUser: TAuthorizedUserRequest,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createUserPayload = this.commonService.injectApiKey({
        email: payload.email,
        authorizedUser,
      });

      this.logger.log(
        'calling auth service > createEmployeeUser with payload:',
      );
      this.logger.log(JSON.stringify(createUserPayload));
      const createUserResponse =
        await this.commonService.processObservable<TCreatedUserEmployeeResponse>(
          this.authClient.send('user.employee.create', createUserPayload),
        );

      const parsedPayload = {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        jobTitle: payload.job_title,
        photoUrl: payload.photo_url,
        userId: createUserResponse.data.id,
      };
      this.logger.log(`create employee with payload:`);
      this.logger.log(JSON.stringify(parsedPayload));
      const employee = await this.employeeRepository.save(parsedPayload);

      await queryRunner.commitTransaction();
      return employee;
    } catch (err) {
      this.logger.error(`Error creating employee`);
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
