import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { IsInt, Min } from "class-validator";
import { Benefit } from "./benefit.entity";
import { Availability } from "./availability.entity";

@Entity()
export class Accommodation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hostId: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @ManyToMany(() => Benefit)
  @JoinTable()
  benefits: Benefit[];

  @OneToMany(() => Availability, (availability) => availability.accommodation, { cascade: true})
  availability: Availability[];

  // @Column("text",{ array: true, nullable: false, default: ()=>'array[]::text[]'})
  @Column({ type: 'simple-array', default: '' })
  photos: string[];

  @Column()
  @IsInt()
  @Min(1)
  minimumGuests: number;

  @Column()
  @IsInt()
  @Min(1)
  maximumGuests: number;

  @Column({ default: false })
  isPerGuest: boolean; // True if price is per person,
  // False if price is for whole accommodation
  @Column({ default: false })
  isAutomatic: boolean; // True if price is per person,
}
