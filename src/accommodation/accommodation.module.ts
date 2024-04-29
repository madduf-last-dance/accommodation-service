import { Module } from "@nestjs/common";
import { AccommodationService } from "./accommodation.service";
import { AccommodationController } from "./accommodation.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Accommodation } from "./entities/accommodation.entity";
import { Benefit } from "./entities/benefit.entity";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "USER_SERVICE",
        transport: Transport.TCP,
        options: {
          port: 1313,
        },
      },
    ]),
    TypeOrmModule.forFeature([Accommodation, Benefit]),
  ],
  controllers: [AccommodationController],
  providers: [AccommodationService],
})
export class AccommodationModule {}
