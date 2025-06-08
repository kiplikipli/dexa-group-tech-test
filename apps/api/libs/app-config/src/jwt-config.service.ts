import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from './app-config.service';

@Injectable()
export class JwtConfigService extends AppConfigService {
  constructor(protected configService: ConfigService) {
    super(configService);
  }

  get jwtConfig() {
    return {
      secret: this.getString('AUTH_SERVICE_JWT_SECRET'),
      accessTokenExpiresIn: this.getNumber(
        'AUTH_SERVICE_JWT_ACCESS_TOKEN_EXPIRES_IN',
      ),
      refreshTokenExpiresIn: this.getNumber(
        'AUTH_SERVICE_JWT_REFRESH_TOKEN_EXPIRES_IN',
      ),
      issuer: this.getString('AUTH_SERVICE_JWT_ISSUER'),
    };
  }
}
