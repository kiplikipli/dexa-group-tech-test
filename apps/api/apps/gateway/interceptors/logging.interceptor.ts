import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { TErrorServiceResponse } from 'types/services/response/service-response.type';

function isError(err: unknown): err is Error {
  return (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    'stack' in err
  );
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const logger = new Logger(context.getClass().name);
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof BadRequestException) {
          logger.error(`Bad Request: ${JSON.stringify(err.getResponse())}`);
        } else if (err satisfies TErrorServiceResponse) {
          const { statusCode, error } = err;
          logger.error(`${statusCode}: ${error}`);
        } else if (isError(err)) {
          logger.error(
            `${err.name}: ${err.message} | ${err.stack?.replace(/\n/g, ' | ')}`,
          );
        } else {
          logger.error(`Unknown error: ${JSON.stringify(err)}`);
        }

        throw err;
      }),
    );
  }
}
