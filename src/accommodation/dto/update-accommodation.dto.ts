import { PartialType } from '@nestjs/mapped-types';
import { AccommodationDto } from './accommodation.dto';

export class UpdateAccommodationDto extends PartialType(AccommodationDto) {
  id: number;
}
