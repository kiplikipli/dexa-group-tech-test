import {
  Controller,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { MessagePattern } from '@nestjs/microservices';
import { ValidApiKeyGuard } from 'shared/guards/valid-api-key.guard';
import { ResponseInterceptor } from 'shared/interceptors/response.interceptor';
import { LoggingInterceptor } from 'shared/interceptors/logging.interceptor';
import { TUpdateEmployeePayload } from './types/update-employee-payload.type';
import { CommonService } from '@app/utils';
import { TEmployeeFindByIdPayload } from './types/employee-find-by-id-payload.type';
import { Employee } from './entities/employee.entity';
import { TUpdateProfilePayload } from './types/update-profile-payload.type';
import { TCreateEmployeePayload } from './types/create-employee-payload.type';
import { TEmployeeFindByUserIdPayload } from './types';

@UseInterceptors(ResponseInterceptor, LoggingInterceptor)
@UseGuards(ValidApiKeyGuard)
@Controller()
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly commonService: CommonService,
  ) {}

  @MessagePattern('employee.getEmployees')
  async getEmployees(payload: Record<string, any>): Promise<Employee[]> {
    const { authorizedUser } = payload;

    if (!authorizedUser || this.commonService.isEmptyObject(authorizedUser)) {
      throw new UnauthorizedException();
    }
    return this.employeeService.getEmployees();
  }

  @MessagePattern('employee.findById')
  async findById(payload: TEmployeeFindByIdPayload): Promise<Employee | null> {
    const { employeeId, authorizedUser } = payload;

    if (!authorizedUser || this.commonService.isEmptyObject(authorizedUser)) {
      throw new UnauthorizedException();
    }
    return this.employeeService.findById(employeeId);
  }

  @MessagePattern('employee.findByUserId')
  async findByUserId(
    payload: TEmployeeFindByUserIdPayload,
  ): Promise<Employee | null> {
    const { userId, authorizedUser } = payload;

    if (!authorizedUser || this.commonService.isEmptyObject(authorizedUser)) {
      throw new UnauthorizedException();
    }
    return this.employeeService.findByUserId(userId);
  }

  @MessagePattern('employee.createEmployee')
  async createEmployee(payload: TCreateEmployeePayload): Promise<Employee> {
    const { authorizedUser, ...restPayload } = payload;

    if (!authorizedUser || this.commonService.isEmptyObject(authorizedUser)) {
      throw new UnauthorizedException();
    }

    const newEmployee = await this.employeeService.createEmployee(
      restPayload,
      authorizedUser,
    );

    return newEmployee;
  }

  @MessagePattern('employee.updateEmployee')
  async updateEmployee(payload: TUpdateEmployeePayload): Promise<Employee> {
    const { employeeId, update, authorizedUser } = payload;

    if (!authorizedUser || this.commonService.isEmptyObject(authorizedUser)) {
      throw new UnauthorizedException();
    }

    return this.employeeService.updateEmployee(
      employeeId,
      update,
      authorizedUser,
    );
  }

  @MessagePattern('employee.updateProfile')
  async updateProfile(payload: TUpdateProfilePayload): Promise<Employee> {
    const { userId, update, authorizedUser } = payload;

    if (!authorizedUser || this.commonService.isEmptyObject(authorizedUser)) {
      throw new UnauthorizedException();
    }

    const employee = await this.employeeService.findByUserId(userId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const payloadUpdate = {
      phone: update.phone,
    };

    return this.employeeService.updateEmployee(
      employee.id,
      payloadUpdate,
      authorizedUser,
    );
  }
}
