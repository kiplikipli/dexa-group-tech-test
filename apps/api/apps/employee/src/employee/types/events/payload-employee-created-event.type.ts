import { TAuthorizedUserRequest } from 'types/services/request/authorized-user-request.type';
import { Employee } from '../../entities/employee.entity';

export type TPayloadEmployeeUpdatedEvent = {
  authorizedUser: TAuthorizedUserRequest;
  oldEmployee: Employee;
  newEmployee: Employee;
};
