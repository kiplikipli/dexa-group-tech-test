import { TAuthorizedServiceRequest } from 'types/services/request/authorized-service-request.type';

export type TEmployeeFindByIdPayload = TAuthorizedServiceRequest<{
  employeeId: number;
}>;
