import { TSuccessServiceResponse } from './service-response.type';

export type TLoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type TAuthServiceLoginResponse = TSuccessServiceResponse<TLoginResponse>;
