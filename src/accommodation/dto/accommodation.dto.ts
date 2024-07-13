import { IsInt, Min, IsString } from 'class-validator';

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

  benefitIds: number[];
}
