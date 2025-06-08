import { TAuthorizedUserRequest } from './authorized-user-request.type';

export type TAuthorizedServiceRequest<TRequest = any> = TRequest & {
  authorizedUser: TAuthorizedUserRequest;
};
