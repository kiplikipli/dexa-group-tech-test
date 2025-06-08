import { ApiKeyConfigService } from '@app/app-config/api-key-config.service';
import { Injectable } from '@nestjs/common';
import {
  Observable,
  catchError,
  throwError,
  finalize,
  map,
  firstValueFrom,
} from 'rxjs';

@Injectable()
export class CommonService {
  constructor(private readonly apiKeyConfig: ApiKeyConfigService) {}

  async processObservable<TObservable, TResponse = TObservable>(
    observable: Observable<TObservable>,
    customMapper?: (res: TObservable) => TResponse,
    customErrorCatcher?: (err: any) => void,
    customFinalizer?: () => void,
  ): Promise<TResponse> {
    let result$: Observable<any> = observable;

    if (customMapper) {
      result$ = result$.pipe(map(customMapper));
    }

    if (customErrorCatcher) {
      result$ = result$.pipe(
        catchError((err) => {
          customErrorCatcher(err);
          return throwError(() => err);
        }),
      );
    }

    if (customFinalizer) {
      result$ = result$.pipe(finalize(customFinalizer));
    }

    return await firstValueFrom(result$ as Observable<TResponse>);
  }

  isNodeError(err: unknown): err is { code: string } {
    return typeof err === 'object' && err !== null && 'code' in err;
  }

  omit(obj, keys) {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => !keys.includes(key)),
    );
  }

  injectApiKey<TPayload = any>(payload: TPayload) {
    return {
      apiKey: this.apiKeyConfig.apiKey,
      ...payload,
    };
  }

  isNumeric(value) {
    return (
      (typeof value === 'number' && Number.isFinite(value)) ||
      (typeof value === 'string' &&
        value.trim() !== '' &&
        !isNaN(Number(value)))
    );
  }

  isEmptyObject(obj: Record<string, any>) {
    return (
      obj &&
      typeof obj === 'object' &&
      !Array.isArray(obj) &&
      Object.keys(obj).length === 0
    );
  }

  isTErrorServiceResponse(obj: Record<string, any>) {
    return (
      obj &&
      typeof obj === 'object' &&
      Object.keys(obj).length === 3 &&
      typeof obj.statusCode === 'number' &&
      obj.success === false &&
      typeof obj.error === 'string'
    );
  }

  omitObject(obj: Record<string, any>, keys: string[]) {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => !keys.includes(key)),
    );
  }
}
