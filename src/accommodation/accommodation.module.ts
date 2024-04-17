import { Module } from '@nestjs/common';
import { AccommodationService } from './accommodation.service';
import { AccommodationController } from './accommodation.controller';

@Module({
  controllers: [AccommodationController],
  providers: [AccommodationService],
})
export class AccommodationModule {}
