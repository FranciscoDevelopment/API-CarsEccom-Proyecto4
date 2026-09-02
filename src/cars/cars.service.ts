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


  async findOneById(id: number) {
    
    const car = await this.prismaORM.cars.findUnique(
      {
        where: {id}
      }
    )

    return car ;

  }


  async findCarsByBrand ( brand : string ) {

    const carsByBrand = await this.prismaORM.cars.findMany(
      {
        where: {brand}
      }
    )

    return carsByBrand

  }


  async findCarsByModel ( model : string ) {

    const carsByModel = await this.prismaORM.cars.findMany(
      {
        where: {model_name: model}
      }
    )

    return carsByModel

  }
  

  async findCarsByVersion ( version : string ) {

    const carsByVersion = await this.prismaORM.cars.findMany(
      {
        where: {version_name: version}
      }
    )

    return carsByVersion

  }


  async findCarsWithoutStock () {

    const carsOutOfStock = await this.prismaORM.cars.findMany(
      {
        where: {quantity: 0}
      }
    )

    return carsOutOfStock

  }


  async findAvailableCars() {

    const carsWithStock = await this.prismaORM.cars.findMany(
      {
        where: {quantity: {gt: 0}  }
      }
    )

    return carsWithStock

  }


  async findCarsByGreaterPriceThan( minPrice : number ) {

      const carsWithPriceGreaterThan = await this.prismaORM.cars.findMany(
        {
          where: {price: {gt: minPrice}}
        }
      )

      return carsWithPriceGreaterThan

    }



  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`;
  }


  remove(id: number) {
    return `This action removes a #${id} car`;
  }


}

