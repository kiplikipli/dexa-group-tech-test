import { TAuthorizedServiceRequest } from 'types/services/request/authorized-service-request.type';

export type TEmployeeFindByUserIdPayload = TAuthorizedServiceRequest<{
  userId: number;
}>;
