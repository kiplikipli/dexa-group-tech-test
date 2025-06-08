import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AUTH_SERVICE, EMPLOYEE_SERVICE } from '../constants';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CommonService } from '@app/utils';
import { TimeoutError } from 'rxjs';
import { TErrorResponse } from 'types/gateway';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE) private client: ClientProxy,
    @Inject(EMPLOYEE_SERVICE) private employeeClient: ClientProxy,
    private readonly commonService: CommonService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const accessTokenHeader = request.headers['authorization'];

    if (!accessTokenHeader) {
      response.status(HttpStatus.UNAUTHORIZED).send({
        success: false,
        error: 'Unauthorized',
      });
      return false;
    }

    const accessToken = accessTokenHeader.split(' ')[1];

    if (!accessToken) {
      response.status(HttpStatus.UNAUTHORIZED).send({
        success: false,
        error: 'Unauthorized',
      });
      return false;
    }

    try {
      const validateTokenResponse = await this.commonService.processObservable(
        this.client.send(
          'auth.validateToken',
          this.commonService.injectApiKey({ token: accessToken }),
        ),
      );

      const { success, data } = validateTokenResponse;
      if (!success) {
        response.status(HttpStatus.UNAUTHORIZED).send({
          success: false,
          error: 'Unauthorized',
        });
        return false;
      }

      const employeeByUserIdResponse =
        await this.commonService.processObservable(
          this.employeeClient.send(
            'employee.findByUserId',
            this.commonService.injectApiKey({
              userId: data.id,
              authorizedUser: data,
            }),
          ),
        );

      const { data: employee } = employeeByUserIdResponse;

      request['jwtToken'] = accessToken;
      request['user'] = {
        userId: data.id,
        role: data.role.key,
        employeeId: employee ? employee.id : null,
      };

      return true;
    } catch (err) {
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let errorMessage = 'Internal Server Error';

      if (
        err instanceof RpcException ||
        (this.commonService.isNodeError(err) && err.code === 'ECONNREFUSED') ||
        err instanceof TimeoutError
      ) {
        errorMessage = 'Bad Gateway';
        statusCode = HttpStatus.BAD_GATEWAY;
      } else if (err satisfies TErrorResponse) {
        errorMessage = err.error;
        statusCode = err.statusCode;
      }

      response.status(statusCode).send({
        success: false,
        error: errorMessage,
      });
      return false;
    }
  }
}
