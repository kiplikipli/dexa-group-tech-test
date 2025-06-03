import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { UtilsModule } from '@app/utils';

@Module({
  imports: [UtilsModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
