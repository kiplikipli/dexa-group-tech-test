import { ApiKeyConfigService } from '@app/app-config/api-key-config.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class ValidApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyConfig: ApiKeyConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const rpcContext = context.switchToRpc();
    const payload = rpcContext.getData();

    const validApiKey = this.apiKeyConfig.apiKey;
    if (payload.apiKey !== validApiKey) {
      throw new RpcException('Unauthorized');
    }

    return true;
  }
}
