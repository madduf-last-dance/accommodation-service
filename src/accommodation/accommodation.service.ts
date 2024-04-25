import { Injectable } from '@nestjs/common';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';

@Injectable()
export class AccommodationService {
  create(createAccommodationDto: CreateAccommodationDto) {
    return 'This action adds a new accommodation';
  }

  findAll() {
    return `This action returns all accommodation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} accommodation`;
  }

  update(id: number, updateAccommodationDto: UpdateAccommodationDto) {
    return `This action updates a #${id} accommodation`;
  }

  remove(id: number) {
    return `This action removes a #${id} accommodation`;
  }
}
