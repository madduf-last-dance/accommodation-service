import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from "typeorm";
import { Accommodation } from "./entities/accommodation.entity";
import { AccommodationDto } from "./dto/accommodation.dto";
import { UpdateAccommodationDto } from "./dto/update-accommodation.dto";
import { Availability } from "./entities/availability.entity";
import { Benefit } from "./entities/benefit.entity";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { SearchDto } from "./dto/search.dto";
import { SearchResultDto } from "./dto/search-result.dto";
import e from "express";
import { elementAt } from "rxjs";
import { relative } from "path";

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

  async create(
    createAccommodationDto: AccommodationDto,
  ): Promise<Accommodation> {
    let accommodation = this.accommodationRepository.create(
      createAccommodationDto,
    );
    accommodation.benefits = await this.benefitRepository.findByIds(
      createAccommodationDto.benefitIds,
    );
    return await this.accommodationRepository.save(accommodation);
  }

  async findAll(): Promise<Accommodation[]> {
    return await this.accommodationRepository.find({
    relations: ["availability"]
    }
    );
  }

  async findOne(id: number): Promise<Accommodation> {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id },
      relations: ["availability"], // "availability" relationship loading
    });
    if (!accommodation) {
      throw new RpcException({ statusCode: 404, message: `Accommodation with ID ${id} not found`});
    }
    return accommodation;
  }

  async update(
    id: number,
    updateAccommodationDto: UpdateAccommodationDto,
  ): Promise<Accommodation> {
    const accommodation = await this.findOne(id);
    this.accommodationRepository.merge(accommodation, updateAccommodationDto);
    return await this.accommodationRepository.save(accommodation);
  }

  async remove(id: number): Promise<void> {
    const accommodation = await this.findOne(id);
    await this.accommodationRepository.remove(accommodation);
  }

  // numberOfGuests is from reservation from reservation-service and price, start-end date is from availability from accommodation-service
  async calculateTotalPrice(
    accommodationId: number,
    numberOfGuests: number,
    price: number,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const accommodation = await this.findOne(accommodationId);
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (accommodation.isPerGuest) {
      return price * numberOfGuests * days;
    } else {
      return price * days;
    }
  }

  async checkAvailability(
    sDate: Date,
    eDate: Date,
    accommodationId: number,
  ): Promise<boolean> {
    const avaliable = await this.availabilityRepository.find({
      where: {
        startDate: LessThanOrEqual(sDate),
        endDate:  MoreThanOrEqual(eDate),
        accommodation: { id: accommodationId },
      },
    });
    if (avaliable.length > 0) {
      return true;
    }
    return false;
  }
  async findAllByHost(hostId: number): Promise<Accommodation[]> {
    const accommodation = await this.accommodationRepository.find({
      where: { hostId: hostId },
      relations: ["availability"], // "availability" relationship loading
    });
    return accommodation;
  }

  deleteHostAccommodations(hostId: number) {
    this.accommodationRepository.delete({ hostId });
  }
  async search(dto: SearchDto): Promise<any[]> {
    const days = Math.ceil(
      (new Date(dto.endDate).getTime() - new Date(dto.startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const availabilities = await this.availabilityRepository
      .createQueryBuilder("availability")
      .leftJoinAndSelect("availability.accommodation", "accommodation")
      .where(
        "availability.endDate >= :endDate AND availability.startDate <= :startDate",
        { startDate: dto.startDate, endDate: dto.endDate },
      )
      .andWhere(
        "accommodation.minimumGuests <= :numberOfGuests AND accommodation.maximumGuests >= :numberOfGuests",
        { numberOfGuests: dto.numberOfGuests },
      )
      .getMany();
    let dtos = [];
    availabilities.forEach((element) =>
      dtos.push(this.processSearchResult(element, days)),
    );
    console.log(dtos);
    return dtos;
  }

  processSearchResult(
    availability: Availability,
    numberOfDays: number,
  ): SearchResultDto {
    return {
      location: availability.accommodation.location,
      minimumGuests: availability.accommodation.minimumGuests,
      maximumGuests: availability.accommodation.maximumGuests,
      startDate: availability.startDate,
      endDate: availability.endDate,
      totalPrice: availability.price * numberOfDays,
      singularPrice: availability.price,
      id: availability.accommodation.id,
      benefits: [],
      name: availability.accommodation.name
    };
  }
}
