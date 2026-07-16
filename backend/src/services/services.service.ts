import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Service } from './entities/service.entity';
import type { CreateServiceDto } from './dto/create-service.dto';
import type { UpdateServiceDto } from './dto/update-service.dto';

import { CloudinaryService } from './cloudinary.service';
import type { Express } from 'express';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly cloudinaryService: CloudinaryService, 
  ) {}

  async create(
    createServiceDto: CreateServiceDto,
    file?: Express.Multer.File,
  ): Promise<Service> {
    
    // Explicitly typed as string | undefined to satisfy TypeORM
    let imageUrl: string | undefined = createServiceDto.image;

    if (file) {
      const upload = await this.cloudinaryService.uploadImage(file);
      imageUrl = (upload as any).secure_url;
    }

    const service = this.serviceRepository.create({
      ...createServiceDto,
      image: imageUrl,
    });

    return await this.serviceRepository.save(service);
  }

  async findAll(): Promise<Service[]> {
    return await this.serviceRepository.find();
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
    file?: Express.Multer.File,
  ): Promise<Service> {
    const service = await this.findOne(id);

    // Explicitly typed as string | undefined
    let imageUrl: string | undefined = updateServiceDto.image;

    if (file) {
      const upload = await this.cloudinaryService.uploadImage(file);
      imageUrl = (upload as any).secure_url;
    }

    Object.assign(service, {
      ...updateServiceDto,
      ...(imageUrl && { image: imageUrl }), 
    });

    return await this.serviceRepository.save(service);
  }

  async remove(id: number): Promise<void> {
    const service = await this.findOne(id);
    await this.serviceRepository.remove(service);
  }
}