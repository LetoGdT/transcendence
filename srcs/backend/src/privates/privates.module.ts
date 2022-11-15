import { Module } from '@nestjs/common';
import { PrivatesController } from './privates.controller';
import { PrivatesService } from './privates.service';

@Module({
  controllers: [PrivatesController],
  providers: [PrivatesService]
})
export class PrivatesModule {}
