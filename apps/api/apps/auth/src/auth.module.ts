import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UtilsModule } from '@app/utils';

@Module({
  imports: [UtilsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
