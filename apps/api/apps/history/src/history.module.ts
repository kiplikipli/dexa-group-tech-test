import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { AppConfigModule } from '@app/app-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmHistoryConfigService } from '@app/app-config/typeorm/typeorm-history-config.service';
import { History } from './entities/history.entity';
import { UtilsModule } from '@app/utils';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [TypeOrmHistoryConfigService],
      useFactory: (configService: TypeOrmHistoryConfigService) => {
        return {
          ...configService.dbHistoryConfig,
          autoLoadEntities: true,
        };
      },
    }),
    TypeOrmModule.forFeature([History]),
    UtilsModule,
  ],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
