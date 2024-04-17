import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { IsInt, Min } from "class-validator";
import { Benefit } from "./benefit.entity";

@Entity()
export class Accommodation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @ManyToMany(() => Benefit)
  @JoinTable()
  benefits: Benefit[];

  @Column()
  photos: string[];

  @Column()
  @IsInt()
  @Min(1)
  minimumGuests: number;

  @Column()
  @IsInt()
  @Min(1)
  maximumGuests: number;
}
