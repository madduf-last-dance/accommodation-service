import { Module } from "@nestjs/common";
import { AccommodationService } from "./accommodation.service";
import { AccommodationController } from "./accommodation.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Accommodation } from "./entities/accommodation.entity";
import { Benefit } from "./entities/benefit.entity";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Availability } from "./entities/availability.entity";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "USER_SERVICE",
        transport: Transport.TCP,
        options: {
          host: 'user-service.default.svc.cluster.local',
          port: 1313,
        },
      },
      {
        name: "RESERVATION_SERVICE",
        transport: Transport.TCP,
        options: {
          host: 'reservation-service.default.svc.cluster.local',
          port: 1315,
        },
      },
    ]),
    TypeOrmModule.forFeature([Accommodation, Benefit, Availability]),
  ],
  controllers: [AccommodationController],
  providers: [AccommodationService],
})
export class AccommodationModule {}
