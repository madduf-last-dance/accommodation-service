import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Accommodation } from "./entities/accommodation.entity";
import { AccommodationDto } from "./dto/accommodation.dto";
import { UpdateAccommodationDto } from "./dto/update-accommodation.dto";
import { AvailabilityDto } from "./dto/availability.dto";
import { Availability } from "./entities/availability.entity";
import { MessagePattern } from "@nestjs/microservices";

@Injectable()
export class AccommodationService {
  constructor(
    @InjectRepository(Accommodation)
    private readonly accommodationRepository: Repository<Accommodation>,
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
  ) {}

  async create(createAccommodationDto: AccommodationDto): Promise<Accommodation> {
    const accommodation = this.accommodationRepository.create(createAccommodationDto);
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

  async checkAvailability(aDto: AvailabilityDto): Promise<Accommodation> {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id: aDto.accommodationId },
      relations: ["availability"],
    });
    if (!accommodation) {
      throw new NotFoundException("Accommodation not found");
    }
    console.log("heej")
    const isAvailable = await this.availabilityRepository
    .createQueryBuilder("availability")
    .leftJoin("availability.accommodation", "accommodation")
    .where("accommodation.id = :id", { id: aDto.accommodationId })
    .andWhere("availability.startDate <= :endDate", { endDate: aDto.endDate })
    .andWhere("availability.endDate >= :startDate", { startDate: aDto.startDate })
    .getOne();

    if (isAvailable) {
      return accommodation;
    } else {
      throw new NotFoundException("Accommodation not available for the specified dates");
    }
  }
  

}
