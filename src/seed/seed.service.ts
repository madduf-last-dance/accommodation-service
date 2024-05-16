import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Accommodation } from "src/accommodation/entities/accommodation.entity";
import { Availability } from "src/accommodation/entities/availability.entity";
import { Benefit } from "src/accommodation/entities/benefit.entity";
import { Repository } from "typeorm";

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Accommodation)
    private readonly accommodationRepository: Repository<Accommodation>,
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
    @InjectRepository(Benefit)
    private readonly benefitRepository: Repository<Benefit>,
  ) {}

  async seed() {
    const checkedAccommodations = await this.accommodationRepository.find();
    if (checkedAccommodations.length !== 0) {
      return;
    }

    const benefits: Partial<Benefit>[] = [
      {
        name: "WC"
      },
      {
        name: "Air Conditioning"
      },
      {
        name: "Terrace"
      }
    ] 
    const savedBenefits = await this.benefitRepository.save(benefits);

    const accommodations: Partial<Accommodation>[] = [
      {
        hostId: 99,
        name: "MN Housing",
        location: "Mala Amerika, Zrenjanin",
        benefits: [savedBenefits[0], savedBenefits[2]],
        photos: "xxx",
        minimumGuests: 1,
        maximumGuests: 12,
        isPerGuest: true
      },
    ];
    const savedAccommodation = await this.accommodationRepository.save(accommodations);

    // YYYY-MM-DD
    const availabilities: Partial<Availability>[] = [
      {
          accommodation: savedAccommodation[0],
          startDate: new Date(2024, 12, 1),
          endDate: new Date(2024, 12, 26),
          price: 65,
      },
      {
          accommodation: savedAccommodation[0],
          startDate: new Date(2024, 10, 1),
          endDate: new Date(2024, 11, 30),
          price: 40,
      },
  ];
    await this.availabilityRepository.save(availabilities);
  }
}
