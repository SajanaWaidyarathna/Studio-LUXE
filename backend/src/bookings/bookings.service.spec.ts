import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Booking } from './entities/booking.entity';
import { ServicesService } from '../services/services.service';
import { BookingsService } from './bookings.service';

describe('BookingsService', () => {
  let service: BookingsService;

  const bookingRepositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const servicesServiceMock = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: bookingRepositoryMock,
        },
        {
          provide: ServicesService,
          useValue: servicesServiceMock,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
