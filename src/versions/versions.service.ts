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
        where: {brand: brand}
      }
    )

    return versionsByBrand

  }


  async findVersionsByModel ( model : string ) {

    const modelsByBrand = await this.prismaORM.versions.findMany(
      {
        where: {model_name: model}
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
