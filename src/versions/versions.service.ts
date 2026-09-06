import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVersionDto } from './dto/create-version.dto';
import { UpdateVersionDto } from './dto/update-version.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { version } from 'node:os';
import { versionRowT, versionVerificationT } from './types/version.type';

@Injectable()
export class VersionsService {

  constructor( private readonly prismaORM : PrismaService ) {}

  

  async create(createVersionDto: CreateVersionDto) {
    
    const existingVersion = await this.prismaORM.versions.findFirst(
      {
        where: createVersionDto as versionVerificationT
      }
    )

    if( existingVersion ) {
      let errors: string[] = [];

      errors.push(`Version "${createVersionDto.name}" already exists for model "${createVersionDto.model_name}"`);

      throw new ConflictException(errors);
    }


    const modelAvailable = await this.prismaORM.models.findUnique( {
      where: {name: createVersionDto.model_name}
    } )

    if( !modelAvailable ) {

      let errors : string[] = [] ;

      errors.push( "The car model is not registered or available" )

      throw new NotFoundException( errors ) 

    }


    return this.prismaORM.versions.create(
      {
        data: createVersionDto,
        select: {name: true, model_name: true, brand: true}
      }
    )

  }


  async findAll() {
  
    return await this.prismaORM.versions.findMany() ;
  
  }

  
  async findWithPagination( page : number, pageSize : number ) {

    return await this.prismaORM.versions.findMany(
      {
        skip: (page - 1) * pageSize,

        take: pageSize,

        orderBy: {id: 'asc'}
      }
    )

  }


  async findAllVersionsWithCarsCounter () {

    return await this.prismaORM.versions.findMany({

      select: {
        name: true,
        model_name: true,
        _count: {select: {cars: true } }
      }

    }) ;

  }


  async findOne(id: number) {
  
    return await this.prismaORM.versions.findUnique(
      {
        where: {id}
      }
    ) 
  
  }


  async findVersionsByBrand ( brand : string ) {

    const versionsByBrand = await this.prismaORM.versions.findMany(
      {
        where: {brand: brand},
        orderBy: {id: "asc"}
      }
    )

    return versionsByBrand

  }


  async findVersionsByModel ( model : string ) {

    const modelsByBrand = await this.prismaORM.versions.findMany(
      {
        where: {model_name: model},
        orderBy: {id: "asc"}
      }
    )

    return modelsByBrand

  }


  async update(id: number, updateVersionDto: UpdateVersionDto) {

    const errors : string[] = []

    
    const existingVersion = await this.prismaORM.versions.findFirst(
      {
        where: updateVersionDto as versionVerificationT
      }
    )

    if( existingVersion ) {
      let errors: string[] = [];

      errors.push(`Version "${updateVersionDto.name}" already exists for model "${updateVersionDto.model_name}"`);

      throw new ConflictException(errors);
    }


    const modelAvailable = await this.prismaORM.models.findUnique( {
      where: {name: updateVersionDto.model_name}
    } )

    if( !modelAvailable ) {

      let errors : string[] = [] ;

      errors.push( "The car model is not registered or available" )

      throw new NotFoundException( errors ) 

    }


    const transaction$ = this.prismaORM.$transaction( async (tx) => {

      const version = await tx.versions.findFirstOrThrow(
        {
          where: {id}
        }
      )
      

      const carsCount = await tx.cars.count(
        {
          where: {
            model_name: version.model_name,
            version_name: version.name
          }
        }
      )

      if( carsCount > 1 ) {

        errors.push(`Version '${version.name}' has more than 1 unit in stock and can't be deleted directly` )

        throw new ConflictException( errors )

      }


      const stock = await tx.cars.aggregate(
        {
          where: {
            model_name: version.model_name,
            version_name: version.name
          },
          _sum: {quantity: true}
        }
      )

      const totalUnits = stock._sum.quantity ?? 0 ;

      if( totalUnits > 1 ){

        errors.push(  `Version '${version.name}' has more than 1 unit in stock and can't be deleted` )

        throw new ConflictException( errors )

      }


      await tx.cars.deleteMany(
        {
          where: {
            model_name: version.model_name,
            version_name: version.name,
          }
        }
      )


      return tx.versions.update(
        {
          where: {id},
          data: updateVersionDto
        }
      )

    } )


    return transaction$


  }


  async remove(id: number) {

    const errors : string[] = []

    const transaction$ = this.prismaORM.$transaction( async (tx) => {

      const version = await tx.versions.findFirstOrThrow(
        {
          where: {id}
        }
      )
      

      const carsCount = await tx.cars.count(
        {
          where: {
            model_name: version.model_name,
            version_name: version.name
          }
        }
      )

      if( carsCount > 1 ) {

        errors.push(`Version '${version.name}' has more than 1 unit in stock and can't be deleted directly` )

        throw new ConflictException( errors )

      }


      const stock = await tx.cars.aggregate(
        {
          where: {
            model_name: version.model_name,
            version_name: version.name
          },
          _sum: {quantity: true}
        }
      )

      const totalUnits = stock._sum.quantity ?? 0 ;

      if( totalUnits > 1 ){

        errors.push(  `Version '${version.name}' has more than 1 unit in stock and can't be deleted` )

        throw new ConflictException( errors )

      }


      await tx.cars.deleteMany(
        {
          where: {
            model_name: version.model_name,
            version_name: version.name,
          }
        }
      )


      return tx.versions.delete({
        where: {id}
      })

    } )


    return transaction$

  }

}
