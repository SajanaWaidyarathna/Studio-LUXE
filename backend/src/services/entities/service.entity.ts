import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({
    type: 'text',
  })
  description!: string;

  @Column()
  duration!: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  price!: number;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @Column({nullable:true})
  image!:string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}