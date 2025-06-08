import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UtilsModule } from '@app/utils';
import { AppConfigModule } from '@app/app-config';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '@app/app-config/jwt-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmAuthConfigService } from '@app/app-config/typeorm/typeorm-auth-config.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AppConfigModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [JwtConfigService],
      useFactory: (jwtConfigService: JwtConfigService) => ({
        secret: jwtConfigService.jwtConfig.secret,
        signOptions: {
          issuer: jwtConfigService.jwtConfig.issuer,
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [TypeOrmAuthConfigService],
      useFactory: (configService: TypeOrmAuthConfigService) => {
        return {
          ...configService.dbAuthConfig,
          autoLoadEntities: true,
        };
      },
    }),
    UserModule,
    UtilsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
