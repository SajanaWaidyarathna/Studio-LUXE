import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

import { Service } from 'src/services/entities/service.entity';
import { Booking } from './entities/booking.entity';
import { ServicesModule } from '../services/services.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Service]),
    ServicesModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService]
})

export class BookingsModule {}
