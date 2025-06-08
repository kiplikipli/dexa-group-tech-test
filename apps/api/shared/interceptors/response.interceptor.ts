import { CommonService } from '@app/utils';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NestInterceptor,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { catchError, map, Observable } from 'rxjs';

type TSuccessResponse<TData = any> = {
  statusCode: HttpStatus;
  success: true;
  data: TData;
};

type TErrorResponse = {
  statusCode: HttpStatus;
  success: false;
  error: string;
};

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly commonService: CommonService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map<any, TSuccessResponse>((res) => ({
        statusCode: HttpStatus.OK,
        success: true,
        data: res,
      })),
      catchError((err) => {
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorMessage = 'Internal Server Error';

        switch (true) {
          case err instanceof UnauthorizedException:
            statusCode = HttpStatus.UNAUTHORIZED;
            errorMessage = err.message;
            break;
          case err instanceof NotFoundException:
            statusCode = HttpStatus.NOT_FOUND;
            errorMessage = err.message;
            break;
          case err instanceof ForbiddenException:
            statusCode = HttpStatus.FORBIDDEN;
            errorMessage = err.message;
            break;
          case err instanceof BadRequestException:
            statusCode = HttpStatus.BAD_REQUEST;
            errorMessage = err.message;
            break;
          case err instanceof UnprocessableEntityException:
            statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
            errorMessage = err.message;
        }

        if (
          this.commonService.isTErrorServiceResponse(err as Record<string, any>)
        ) {
          statusCode = err.statusCode;
          errorMessage = err.error;
        }

        const response: TErrorResponse = {
          statusCode,
          success: false,
          error: errorMessage,
        };

        throw new RpcException(response);
      }),
    );
  }
}
