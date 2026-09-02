import { Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { carRowT, carT, createCarInputI } from './types/car.types';

@Injectable()
export class CarsService {

  constructor(
    private readonly prismaORM : PrismaService
  ) {}


  async create(createCarDto: CreateCarDto) {
    
    return this.prismaORM.cars.create(
      {
        data: createCarDto,
        select: { brand: true, model_name: true, version_name: true, created_at: true }
      }
    )
  
  }


  async findAll() {
    return await this.prismaORM.cars.findMany() ;
  }


  async findOne(id: number) {
    
    

  }


  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`;
  }


  remove(id: number) {
    return `This action removes a #${id} car`;
  }


}

