import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, MoreThan, Repository } from "typeorm";
import { Accommodation } from "./entities/accommodation.entity";
import { AccommodationDto } from "./dto/accommodation.dto";
import { UpdateAccommodationDto } from "./dto/update-accommodation.dto";
import { Availability } from "./entities/availability.entity";
import { Benefit } from "./entities/benefit.entity";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class AccommodationService {
  constructor(
    @InjectRepository(Accommodation)
    private readonly accommodationRepository: Repository<Accommodation>,
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
    @InjectRepository(Benefit)
    private readonly benefitRepository: Repository<Benefit>,
    @Inject("RESERVATION_SERVICE")
    private readonly reservationClient: ClientProxy,
  ) {}

  async create(createAccommodationDto: AccommodationDto): Promise<Accommodation> {
    let accommodation = this.accommodationRepository.create(createAccommodationDto);
    accommodation.benefits = await this.benefitRepository.findByIds(createAccommodationDto.benefitIds);
    return await this.accommodationRepository.save(accommodation);
  }

  async findAll(): Promise<Accommodation[]> {
    return await this.accommodationRepository.find();
  }

  async findOne(id: number): Promise<Accommodation> {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id },
      relations: ["availability"], // "availability" relationship loading
    });
    if (!accommodation) {
      throw new NotFoundException(`Accommodation with ID ${id} not found`);
    }
    return accommodation;
  }
  

  async update(id: number, updateAccommodationDto: UpdateAccommodationDto): Promise<Accommodation> {
    const accommodation = await this.findOne(id);
    this.accommodationRepository.merge(accommodation, updateAccommodationDto);
    return await this.accommodationRepository.save(accommodation);
  }

  async remove(id: number): Promise<void> {
    const accommodation = await this.findOne(id);
    await this.accommodationRepository.remove(accommodation);
  }

  // numberOfGuests is from reservation from reservation-service and price, start-end date is from availability from accommodation-service
  async calculateTotalPrice(accommodationId: number, numberOfGuests: number, price: number,
    startDate: Date, endDate: Date
  ): Promise<number>{
    
    const accommodation = await this.findOne(accommodationId);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (accommodation.isPerGuest) {
      return price * numberOfGuests * days;
    } else {
      return price * days;
    }
  };

  async checkAvailability(sDate: Date, eDate: Date, accommodationId: number,): Promise<boolean> {
    const avaliable = await this.availabilityRepository.find({
      where: {
        startDate: MoreThan(sDate),
        endDate: LessThan(eDate),
        accommodation: { id: accommodationId },
      },
    });
    if(avaliable.length > 0){
      return true;
    }
    return false;
  }
 
  async search(location: string, numberOfGuests: number, startDate: Date, endDate: Date) {
    return await this.accommodationRepository.find();
  }

}

