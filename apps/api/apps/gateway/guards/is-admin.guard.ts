import { CommonService } from '@app/utils';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../constants';
import { Request, Response } from 'express';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE) private client: ClientProxy,
    private readonly commonService: CommonService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const jwtToken = request['jwtToken'];

    const authRes = await this.commonService.processObservable(
      this.client.send(
        'auth.getUserByToken',
        this.commonService.injectApiKey({ token: jwtToken }),
      ),
    );

    const data = authRes.data;
    if (data?.role?.key !== 'admin') {
      response.status(HttpStatus.FORBIDDEN).send({
        success: false,
        error: 'Forbidden',
      });
      return false;
    }

    return true;
  }
}
