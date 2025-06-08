import { TAuthorizedServiceRequest } from 'types/services/request';

export type TLogoutRequest = TAuthorizedServiceRequest<{
  userId: number;
}>;
