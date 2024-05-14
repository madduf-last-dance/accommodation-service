import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AvailabilityDto {

    accommodationId: number;
    startDate: Date;
    endDate: Date;
    price: number;

}