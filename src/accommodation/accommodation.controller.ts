import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccommodationService } from './accommodation.service';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';

@Controller()
export class AccommodationController {
  constructor(private readonly accommodationService: AccommodationService) {}

  @MessagePattern('createAccommodation')
  create(@Payload() createAccommodationDto: CreateAccommodationDto) {
    return this.accommodationService.create(createAccommodationDto);
  }

  @MessagePattern('findAllAccommodation')
  findAll() {
    return this.accommodationService.findAll();
  }

  @MessagePattern('findOneAccommodation')
  findOne(@Payload() id: number) {
    return this.accommodationService.findOne(id);
  }

  @MessagePattern('updateAccommodation')
  update(@Payload() updateAccommodationDto: UpdateAccommodationDto) {
    return this.accommodationService.update(updateAccommodationDto.id, updateAccommodationDto);
  }

  @MessagePattern('removeAccommodation')
  remove(@Payload() id: number) {
    return this.accommodationService.remove(id);
  }
}
