import { Injectable } from '@nestjs/common';
import { CreateVersionDto } from './dto/create-version.dto';
import { UpdateVersionDto } from './dto/update-version.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VersionsService {

  constructor( private readonly prismaORM : PrismaService ) {}


  create(createVersionDto: CreateVersionDto) {
    
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
    
    return await this.prismaORM.versions.update(
      {
        where: {id},
        data: updateVersionDto
      }
    )

  }


  async remove(id: number) {
    return await this.prismaORM.versions.delete(
      {
        where: {id}
      }
    )
  }

}
