import {
  BadRequestException,
  Controller,
  Logger,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { TLoginResponse } from 'types/services/response';
import { JsonWebTokenError } from '@nestjs/jwt';
import { ResponseInterceptor } from '../../../shared/interceptors/response.interceptor';
import {
  TGetUserRequest,
  TLoginRequest,
  TValidateTokenRequest,
} from 'types/services/request';
import { ValidApiKeyGuard } from 'shared/guards/valid-api-key.guard';
import { TUpdatePasswordRequest } from './types/update-password-request.type';
import { LoggingInterceptor } from 'shared/interceptors/logging.interceptor';
import { TCreateEmployeePayload } from 'apps/employee/src/employee/types/create-employee-payload.type';
import { TLogoutRequest } from './types/logout-request.type';
import { TRefreshTokenRequest } from './types/refresh-token-request.type';
import { CommonService } from '@app/utils';

@UseInterceptors(ResponseInterceptor, LoggingInterceptor)
@UseGuards(ValidApiKeyGuard)
@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly commonService: CommonService,
  ) {}

  @MessagePattern('auth.login')
  async login(payload: TLoginRequest): Promise<TLoginResponse> {
    if (!payload || !payload.username || !payload.password) {
      throw new BadRequestException('Invalid request payload');
    }

    const { username, password, isAdminOnly } = payload;
    return await this.authService.login(username, password, isAdminOnly);
  }

  @MessagePattern('auth.refreshToken')
  async refreshToken(payload: TRefreshTokenRequest): Promise<any> {
    if (!payload.refreshToken) {
      throw new BadRequestException('Invalid request payload');
    }

    return await this.authService.refreshToken(payload);
  }

  @MessagePattern('auth.logout')
  async logout(payload: TLogoutRequest): Promise<any> {
    const authorizedUser = payload.authorizedUser;
    if (!authorizedUser || this.commonService.isEmptyObject(authorizedUser)) {
      throw new UnauthorizedException();
    }

    return await this.authService.logout(payload);
  }

  @MessagePattern('auth.validateToken')
  async validateToken(payload: TValidateTokenRequest): Promise<any> {
    try {
      const res = await this.authService.validateToken(payload.token);
      return res;
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }

      throw err;
    }
  }

  @MessagePattern('auth.getUserByToken')
  async getUser(payload: TGetUserRequest): Promise<any> {
    return await this.authService.getUserByToken(payload.token);
  }

  @MessagePattern('auth.updatePassword')
  async updatePassword(payload: TUpdatePasswordRequest): Promise<any> {
    return await this.authService.updatePassword(payload);
  }

  @MessagePattern('user.employee.create')
  async createUserEmployee(payload: TCreateEmployeePayload): Promise<any> {
    const authorizedUser = payload.authorizedUser;
    if (!authorizedUser || this.commonService.isEmptyObject(authorizedUser)) {
      throw new UnauthorizedException();
    }

    this.logger.log(`processing create user employee payload`);
    this.logger.log(JSON.stringify(payload));
    return await this.authService.createEmployeeUser(payload);
  }
}
