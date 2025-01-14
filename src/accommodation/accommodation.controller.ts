import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AccommodationService } from "./accommodation.service";
import { AccommodationDto } from "./dto/accommodation.dto";
import { UpdateAccommodationDto } from "./dto/update-accommodation.dto";
import { AvailabilityDto } from "./dto/availability.dto";
import { Accommodation } from "./entities/accommodation.entity";
import { SearchDto } from "./dto/search.dto";
import { Availability } from "./entities/availability.entity";

@Controller()
export class AccommodationController {
  constructor(private readonly accommodationService: AccommodationService) {}

  @MessagePattern("createAccommodation")
  create(@Payload() createAccommodationDto: AccommodationDto) {
    return this.accommodationService.create(createAccommodationDto);
  }

  @MessagePattern("findAllAccommodation")
  findAll() {
    return this.accommodationService.findAll();
  }

  @MessagePattern("findOneAccommodation")
  findOne(@Payload() id: number) {
    return this.accommodationService.findOne(id);
  }

  @MessagePattern("updateAccommodation")
  update(@Payload() updateAccommodationDto: UpdateAccommodationDto) {
    return this.accommodationService.update(
      updateAccommodationDto.id,
      updateAccommodationDto,
    );
  }

  @MessagePattern("removeAccommodation")
  remove(@Payload() id: number) {
    return this.accommodationService.remove(id);
  }

  @MessagePattern("checkAvailability")
  async checkAvailability(aDto: AvailabilityDto): Promise<boolean> {
    return this.accommodationService.checkAvailability(
      aDto.startDate,
      aDto.endDate,
      aDto.accommodationId,
    );
  }

  @MessagePattern("calculateTotalPrice")
  async calculateTotalPrice(
    accommodationId: number,
    numberOfGuests: number,
    price: number,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return this.accommodationService.calculateTotalPrice(
      accommodationId,
      numberOfGuests,
      price,
      startDate,
      endDate,
    );
  }

  @MessagePattern("findAllAccommodationsHost")
  async findAllAccommodationsHost(hostId: number): Promise<Accommodation[]> {
    return this.accommodationService.findAllByHost(hostId);
  }

  @MessagePattern("deleteHostAccommodations")
  async deleteHostAccommodations(hostId: number) {
    this.accommodationService.deleteHostAccommodations(hostId);
  }
  @MessagePattern("search")
  async search(dto: SearchDto): Promise<any[]> {
    return this.accommodationService.search(dto);
  }
}
