import { IsInt, Min, IsString } from 'class-validator';
import { Benefit } from '../entities/benefit.entity';

export class AccommodationDto {
  @IsString()
  name: string;

  @IsString()
  location: string;


  @IsInt()
  @Min(1)
  minimumGuests: number;

  @IsInt()
  @Min(1)
  maximumGuests: number;
}
