import {
  IsEmail,
  IsString,
  IsInt,
  IsOptional,
} from 'class-validator';

export class CreateBookingDto {

  @IsString()
  customerName!: string;

  @IsEmail()
  customerEmail!: string;

  @IsString()
  customerPhone!: string;

  @IsInt()
  serviceId!: number;

  @IsString()
  bookingDate!: string;

  @IsString()
  bookingTime!: string;

  @IsOptional()
  @IsString()
  notes?: string;

}