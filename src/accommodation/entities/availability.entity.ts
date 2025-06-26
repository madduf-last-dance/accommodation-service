import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Accommodation } from "./accommodation.entity";

@Entity()
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Accommodation, (accommodation) => accommodation.availability, { onDelete: 'CASCADE' })
  accommodation: Accommodation;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date" })
  endDate: Date;

  @Column()
  price: number;
}
