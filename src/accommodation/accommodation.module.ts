import { Module } from "@nestjs/common";
import { AccommodationService } from "./accommodation.service";
import { AccommodationController } from "./accommodation.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Accommodation } from "./entities/accommodation.entity";
import { Benefit } from "./entities/benefit.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Accommodation, Benefit])],
  controllers: [AccommodationController],
  providers: [AccommodationService],
})
export class AccommodationModule {}
