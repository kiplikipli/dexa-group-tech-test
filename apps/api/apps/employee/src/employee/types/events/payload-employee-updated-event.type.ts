import { TAuthorizedUserRequest } from 'types/services/request';
import { Employee } from '../../entities/employee.entity';

export type TPayloadEmployeeCreatedEvent = {
  authorizedUser: TAuthorizedUserRequest;
  employee: Employee;
};
