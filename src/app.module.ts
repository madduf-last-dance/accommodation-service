import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AccommodationModule } from "./accommodation/accommodation.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Availability } from "./accommodation/entities/availability.entity";
import { SeedModule } from "./seed/seed.module";

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
    AccommodationModule,
    SeedModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
