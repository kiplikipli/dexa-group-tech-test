import { JwtConfigService } from '@app/app-config/jwt-config.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from 'interfaces/services';
import { TLoginResponse } from 'types/services/response/auth-service-response.type';
import { UserService } from './user/user.service';
import * as bcrypt from 'bcrypt';
import { CommonService } from '@app/utils';
import { TUpdatePasswordRequest } from './types/update-password-request.type';
import { TCreateEmployeePayload } from 'apps/employee/src/employee/types/create-employee-payload.type';
import { TLogoutRequest } from './types/logout-request.type';
import { TRefreshTokenRequest } from './types/refresh-token-request.type';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
  ) {}

  async validateToken(token: string): Promise<any> {
    const claims = await this.jwtService.verifyAsync<{ sub: string }>(token);
    const { sub } = claims;
    if (!sub || !this.commonService.isNumeric(sub)) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const parsedSub = parseInt(sub);
    const user = await this.userService.findById(parsedSub);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    return user;
  }

  async login(
    username: string,
    password: string,
    isAdminOnly: boolean = false,
  ): Promise<TLoginResponse> {
    const user = await this.userService.findByEmail(username);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    if (isAdminOnly && user.role.key !== 'admin') {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload = {
      sub: user.id,
    };

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.jwtConfigService.jwtConfig.refreshTokenExpiresIn,
    });

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.jwtConfigService.jwtConfig.accessTokenExpiresIn,
    });

    await this.userService.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(payload: TLogoutRequest): Promise<any> {
    const userId = payload.userId;
    await this.userService.emptyRefreshToken(userId);

    return true;
  }

  async refreshToken(
    payload: TRefreshTokenRequest,
  ): Promise<{ accessToken: string }> {
    const userId = payload.authorizedUser.userId;
    const refreshToken = payload.refreshToken;

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.latestRefreshToken) {
      throw new UnauthorizedException('Invalid');
    }

    if (!bcrypt.compareSync(refreshToken, user.latestRefreshToken)) {
      throw new UnauthorizedException('Invalid');
    }

    const jwtPayload = {
      sub: user.id,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: this.jwtConfigService.jwtConfig.accessTokenExpiresIn,
    });

    return { accessToken };
  }

  async getUserByToken(token: string): Promise<any> {
    const payload = await this.jwtService.verifyAsync(token);
    const userId = payload.sub;

    const user = await this.userService.findById(userId as number);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    return this.commonService.omit(user, ['password']);
  }

  async updatePassword(payload: TUpdatePasswordRequest): Promise<any> {
    const { userId, oldPassword, newPassword, confirmNewPassword } = payload;
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    if (!bcrypt.compareSync(oldPassword, user.password)) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.updatePassword(userId, hashedPassword);

    return true;
  }

  async createEmployeeUser(payload: TCreateEmployeePayload): Promise<any> {
    return await this.userService.createEmployeeUser(
      payload,
      payload.authorizedUser,
    );
  }
}
