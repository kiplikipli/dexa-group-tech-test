import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from './app-config.service';

@Injectable()
export class ApiKeyConfigService extends AppConfigService {
  constructor(protected configService: ConfigService) {
    super(configService);
  }

  get apiKey(): string {
    return this.getString('API_KEY');
  }
}
