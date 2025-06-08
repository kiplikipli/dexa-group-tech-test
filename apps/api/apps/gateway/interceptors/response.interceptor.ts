import { CommonService } from '@app/utils';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { catchError, map, Observable, of, TimeoutError } from 'rxjs';
import { TErrorResponse, TSuccessResponse } from 'types/gateway';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly commonService: CommonService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const res = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map<any, TSuccessResponse>((res) => ({
        success: true,
        data: res,
      })),
      catchError((err) => {
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorMessage = 'Internal Server Error';

        if (
          err instanceof RpcException ||
          (this.commonService.isNodeError(err) &&
            err.code === 'ECONNREFUSED') ||
          err instanceof TimeoutError
        ) {
          errorMessage = 'Bad Gateway';
          statusCode = HttpStatus.BAD_GATEWAY;
        } else if (err instanceof BadRequestException) {
          const response = err.getResponse();
          statusCode = HttpStatus.BAD_REQUEST;
          errorMessage = '';
          if (
            Array.isArray(response['message']) &&
            response['message'].length > 0
          ) {
            errorMessage = response['message'][0];
          } else if (typeof response['message'] === 'string') {
            errorMessage = response['message'];
          }
        } else if (err instanceof UnauthorizedException) {
          statusCode = HttpStatus.UNAUTHORIZED;
          errorMessage = err.message;
        } else if (this.commonService.isTErrorServiceResponse(err)) {
          const { statusCode: errStatusCode, error } = err;
          statusCode = errStatusCode;
          errorMessage = error;
        }

        res.status(statusCode);
        return of({
          success: false,
          error: errorMessage,
        } as TErrorResponse);
      }),
    );
  }
}
