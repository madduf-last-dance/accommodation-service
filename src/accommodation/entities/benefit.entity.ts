import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Benefit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
