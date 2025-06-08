import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(protected configService: ConfigService) {}

  protected get(key: string): string {
    const value = this.configService.get<string>(key);

    if (!value) {
      throw new Error(`${key} environment variable does not set`);
    }

    return value;
  }

  protected getNumber(key: string): number {
    const value = this.get(key);
    try {
      const numVal = Number(value);
      if (Number.isNaN(numVal)) {
        throw new Error();
      }
      return numVal;
    } catch {
      throw new Error(`${key} environment variable is not a number`);
    }
  }

  protected getString(key: string): string {
    return this.get(key);
  }

  protected getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(`${key} environment variable is not a boolean`);
    }
  }
}
