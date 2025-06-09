import { TAuthorizedServiceRequest } from 'types/services/request';

export type TUpdatePasswordRequest = TAuthorizedServiceRequest<{
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}>;
