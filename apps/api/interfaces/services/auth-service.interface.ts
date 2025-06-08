import { TLoginResponse } from 'types/services/response';

export interface IAuthService {
  login(username: string, password: string): Promise<TLoginResponse>;
}
