import { JwtConfigService } from '@app/app-config/jwt-config.service';
import { CommonService } from '@app/utils';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from 'apps/gateway/constants';
import { Request, Response } from 'express';
import { TGatewayAuthLoginResponse } from 'types/gateway';
import { TAuthServiceLoginResponse } from 'types/services/response';
import { LoginDto } from './dto/login.dto';
import { AuthenticatedGuard } from 'apps/gateway/guards';
import { UpdatePasswordRequest } from './dto/update-password.dto';

@Controller('auth')
export class GatewayAuthController {
  private readonly logger: Logger = new Logger(GatewayAuthController.name);
  constructor(
    @Inject(AUTH_SERVICE) private client: ClientProxy,
    private readonly commonService: CommonService,
    private readonly jwtConfigService: JwtConfigService,
  ) {}

  @Post('login-admin')
  @HttpCode(HttpStatus.OK)
  async loginAdmin(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ): Promise<TGatewayAuthLoginResponse | { error: string }> {
    return await this.login(res, loginDto, true);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
    isAdminOnly = false,
  ): Promise<TGatewayAuthLoginResponse | { error: string }> {
    if (!loginDto) {
      throw new BadRequestException('Invalid request body');
    }

    const { email, password } = loginDto;

    const payload = this.commonService.injectApiKey({
      username: email,
      password: password,
      isAdminOnly,
    });

    this.logger.log(`calling auth service > login with payload:`);
    this.logger.log(JSON.stringify(payload));
    const response =
      await this.commonService.processObservable<TAuthServiceLoginResponse>(
        this.client.send('auth.login', payload),
      );

    const tokens = response.data;
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(
        Date.now() + this.jwtConfigService.jwtConfig.refreshTokenExpiresIn,
      ),
    });

    return {
      accessToken: tokens.accessToken,
    };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request) {
    const refreshToken = req['cookies']['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const payload = this.commonService.injectApiKey({
      refreshToken,
    });

    this.logger.log(`calling auth service > refreshToken with payload:`);
    this.logger.log(JSON.stringify(payload));
    const response = await this.commonService.processObservable(
      this.client.send('auth.refreshToken', payload),
    );

    return response.data;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const authorizedUser = req['user'];
    const payload = this.commonService.injectApiKey({
      userId: authorizedUser.userId,
      authorizedUser,
    });

    this.logger.log(`calling auth service > logout with payload:`);
    this.logger.log(JSON.stringify(payload));
    await this.commonService.processObservable(
      this.client.send('auth.logout', payload),
    );

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    return null;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  async getUser(@Req() req: Request): Promise<any> {
    const payload = this.commonService.injectApiKey({
      token: req['jwtToken'],
    });
    this.logger.log(`calling auth service > getUserByToken with payload:`);
    this.logger.log(JSON.stringify(payload));
    const response = await this.commonService.processObservable(
      this.client.send('auth.getUserByToken', payload),
    );

    return response.data;
  }

  @UseGuards(AuthenticatedGuard)
  @Put('update-password')
  async updatePassword(
    @Req() req: Request,
    @Body() updatePasswordRequest: UpdatePasswordRequest,
  ) {
    const { oldPassword, newPassword, confirmNewPassword } =
      updatePasswordRequest;

    const payload = this.commonService.injectApiKey({
      authorizedUser: req['user'],
      oldPassword,
      newPassword,
      confirmNewPassword,
    });

    this.logger.log(`calling auth service > updatePassword with payload:`);
    this.logger.log(JSON.stringify(payload));
    const response = await this.commonService.processObservable(
      this.client.send('auth.updatePassword', payload),
    );

    return response.data;
  }
}
