import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { SeedService } from "./seed/seed.service";
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: "0.0.0.0",
        port: 1312,
      },
    },
  );
  app.useLogger(new Logger());
  await app.get(SeedService).seed();
  await app.listen();
}
bootstrap();
