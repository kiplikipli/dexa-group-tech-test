import { TAuthorizedServiceRequest } from 'types/services/request/authorized-service-request.type';

export type TUpdateEmployeePayload = TAuthorizedServiceRequest<{
  employeeId: number;
  update: {
    name?: string;
    email?: string;
    phone?: string;
    job_title?: string;
  };
}>;
