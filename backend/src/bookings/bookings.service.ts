import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { Booking } from './entities/booking.entity';

import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

import { ServicesService } from '../services/services.service';
import { BookingStatus } from './enums/booking-status.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly servicesService: ServicesService,
  ) {}

  private normalizeStatus(status?: BookingStatus): BookingStatus | undefined {
    if (!status) {
      return undefined;
    }

    if (!Object.values(BookingStatus).includes(status)) {
      throw new BadRequestException('Invalid booking status');
    }

    return status;
  }

  private buildSearchConditions(
    searchTerm: string,
    status?: BookingStatus,
  ): FindOptionsWhere<Booking>[] {
    const searchValue = ILike(`%${searchTerm}%`);
    const statusFilter = status ? { status } : {};

    return [
      { ...statusFilter, customerName: searchValue },
      { ...statusFilter, customerEmail: searchValue },
      { ...statusFilter, customerPhone: searchValue },
      { ...statusFilter, bookingTime: searchValue },
      { ...statusFilter, notes: searchValue },
    ];
  }

  async findAll(filters?: {
    search?: string;
    status?: BookingStatus;
  }): Promise<Booking[]> {
    const searchTerm = filters?.search?.trim();
    const status = this.normalizeStatus(filters?.status);

    if (!searchTerm) {
      return await this.bookingRepository.find({
        ...(status ? { where: { status } } : {}),
        order: {
          createdAt: 'DESC',
        },
      });
    }

    return await this.bookingRepository.find({
      where: this.buildSearchConditions(searchTerm, status),
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findUserBookings(userId: number) {
    // 🛡️ THE SHIELD: If userId is missing, stop immediately and return an empty array.
    if (!userId) {
      console.error("FAILSAFE TRIGGERED: findUserBookings was called without a userId!");
      return [];
    }

    return this.bookingRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        service: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  // 👇 Updated to accept userId as a second parameter
  async create(createBookingDto: CreateBookingDto, userId?: number): Promise<Booking> {
    console.log("DETECTIVE: Attempting to create booking for User ID:", userId);
    // 1. Check service exists
    const service = await this.servicesService.findOne(
      createBookingDto.serviceId,
    );

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // 2. Check date is not in the past
    const today = new Date();
    // Reset time on today's date so bookings for later today aren't accidentally blocked
    today.setHours(0, 0, 0, 0); 
    
    const bookingDate = new Date(createBookingDto.bookingDate);

    if (bookingDate < today) {
      throw new BadRequestException('Booking date cannot be in the past');
    }

    // 3. Prevent duplicate booking
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        serviceId: createBookingDto.serviceId,
        bookingDate: createBookingDto.bookingDate,
        bookingTime: createBookingDto.bookingTime,
      },
    });

    if (existingBooking) {
      throw new BadRequestException('This time slot is already booked');
    }

    // 4. Create booking and safely attach the user if an ID was provided
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      service,
      user: userId ? { id: userId } : undefined, // 👈 Maps the database relation!
      status: BookingStatus.PENDING,
    });

    return await this.bookingRepository.save(booking);
  }

  async updateStatus(
    id: number,
    updateBookingStatusDto: UpdateBookingStatusDto,
  ): Promise<Booking> {
    const booking = await this.findOne(id);
    booking.status = updateBookingStatusDto.status;
    return await this.bookingRepository.save(booking);
  }

  async cancel(id: number): Promise<Booking> {
    const booking = await this.findOne(id);
    booking.status = BookingStatus.CANCELLED;
    return await this.bookingRepository.save(booking);
  }
}