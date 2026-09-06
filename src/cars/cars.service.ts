import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { carRowT, carT, carVerificationT, createCarInputI } from './types/car.types';

@Injectable()
export class CarsService {

  constructor(private readonly prismaORM : PrismaService ) {}


  async create(createCarDto: CreateCarDto) {
    
    const existingCar = await this.prismaORM.cars.findFirst({
      where: createCarDto as carVerificationT,
    })

    if (existingCar) {

      return this.prismaORM.cars.update(
        {
          where: {id: existingCar.id},
          
          data: {quantity: {increment: 1} },
          
          select: {brand: true, model_name: true, version_name: true, quantity: true}
        }
      )
    }
  
    
    const modelAvailable = await this.prismaORM.models.findUnique( {
      where: {name: createCarDto.model_name}
    } )

    if( !modelAvailable ) {

      let errors : string[] = [] ;

      errors.push( "The car model is not registered or available" )

      throw new NotFoundException( errors ) 

    }


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


  async findWithPagination( page : number, pageSize : number ) {

    return await this.prismaORM.cars.findMany(
      {
        skip: (page - 1) * pageSize,
        
        take: pageSize,

        orderBy: {id: 'asc'}
      }
    )

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


  async findCarsByLowerPriceThan( maxPrice : number ) {

    const carsWithPriceLowerThan = await this.prismaORM.cars.findMany(
      {
        where: {price: {lt: maxPrice} }
      }
    )

    return carsWithPriceLowerThan

  }


  update(id: number, updateCarDto: UpdateCarDto) {
    return this.prismaORM.cars.update(
      {
        where: {id},
        data: updateCarDto
      }
    )
  }


  remove(id: number) {
    return this.prismaORM.cars.delete(
      {
        where: {id}
      }
    )
  }

  
  removeCarsWithOutStock( version : string ) {

    return this.prismaORM.cars.deleteMany(
      {
        where: {
          version_name: version ,
          quantity: 0
        }
      }
    )

  }

}

