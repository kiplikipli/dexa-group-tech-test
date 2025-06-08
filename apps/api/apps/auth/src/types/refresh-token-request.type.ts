import { TAuthorizedServiceRequest } from 'types/services/request';

export type TRefreshTokenRequest = TAuthorizedServiceRequest<{
  refreshToken: string;
}>;
