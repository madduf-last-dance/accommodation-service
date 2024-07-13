import { Module } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Accommodation } from "src/accommodation/entities/accommodation.entity";
import { Availability } from "src/accommodation/entities/availability.entity";
import { Benefit } from "src/accommodation/entities/benefit.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Accommodation, Availability, Benefit])
  ],
  providers: [SeedService],
})
export class SeedModule {}
