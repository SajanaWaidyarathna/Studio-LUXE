import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Service } from '../../services/entities/service.entity';
import { User } from '../../users/entities/user.entity'; // <-- Imported User
import { BookingStatus } from '../enums/booking-status.enum';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  customerName!: string;

  @Column()
  customerEmail!: string;

  @Column()
  customerPhone!: string;

  // --- Service Relation ---
  @ManyToOne(() => Service, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'serviceId' })
  service!: Service;

  @Column()
  serviceId!: number;

  // --- User Relation ---
  @ManyToOne(() => User, (user) => user.bookings, {
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user?: User; // Typed as optional because of nullable: true

  @Column({ nullable: true })
  userId?: number; // Added to match your serviceId pattern for easier inserts!

  // --- Booking Details ---
  @Column({
    type: 'date',
  })
  bookingDate!: string;

  @Column()
  bookingTime!: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status!: BookingStatus;

  @Column({
    nullable: true,
    type: 'text',
  })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}