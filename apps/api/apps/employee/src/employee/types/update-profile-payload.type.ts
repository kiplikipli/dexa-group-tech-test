import { TAuthorizedServiceRequest } from 'types/services/request/authorized-service-request.type';

export type TUpdateProfilePayload = TAuthorizedServiceRequest<{
  userId: number;
  update: {
    phone?: string;
  };
}>;
