import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { BookingStatus } from './enums/booking-status.enum';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() dto: CreateBookingDto, @Req() req: any) {
    let userId = undefined;

    // 👇 MANUALLY READ THE TOKEN (The Optional Auth Fix)
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        // Decode the middle part of the JWT (the payload) to find the ID
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        userId = payload.sub || payload.id || payload.userId;
      } catch (e) {
        console.error("Token decode failed, proceeding as Guest.");
      }
    }

    // This will now successfully print your ID!
    console.log("DETECTIVE: Creating booking for User ID:", userId || "GUEST");

    return this.bookingsService.create(dto, userId);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: BookingStatus,
  ) {
    return this.bookingsService.findAll({
      search,
      status,
    });
  }

  // NOTE: This must go BEFORE @Get(':id') so 'my-bookings' isn't mistaken for an ID parameter!
  @Get('my-bookings')
  @UseGuards(JwtAuthGuard)
  findMyBookings(@Req() req: any) {
    // 👇 CONSOLE LOG TRAP
    console.log("WHO IS LOGGED IN? ->", req.user);

    // Try multiple properties just in case your JwtStrategy renamed it
    const userId = req.user?.sub || req.user?.id || req.user?.userId;
    
    return this.bookingsService.findUserBookings(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, dto);
  }

  @Patch(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.cancel(id);
  }
}