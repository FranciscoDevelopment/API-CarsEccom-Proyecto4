import { Injectable } from '@nestjs/common';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ModelsService {

  constructor( private readonly prismaORM : PrismaService ) {}

  create(createModelDto: CreateModelDto) {
    
    return this.prismaORM.models.create(
      {
        data: createModelDto,
        select: {name: true, brand: true}
      }
    )

  }


  async findAll() {
    return await this.prismaORM.models.findMany({
      select: {
        name: true,
        versionsByModelName: true,
        _count: {select: {cars: true}}
      }
    })  
  }


  async findOneById(id: number) {
    
    const car = await this.prismaORM.models.findUnique(
      {
        where: {id},
        include: {versionsByModelId: true}
      }
    )

    return car ;

  }

  async findModelsByBrand ( brand : string ) {

    const modelsByBrand = await this.prismaORM.models.findMany(
      {
        where: {brand: brand},
        include: {versionsByModelName: true},
        orderBy: {id: "asc"}
      },
      
    )

    return modelsByBrand

  }

  async update(id: number, updateModelDto: UpdateModelDto) {
    
    return await this.prismaORM.models.update(
      {
        where: {id},
        data: updateModelDto
      }
    )
  
  }

  async remove(id: number) {
    return this.prismaORM.models.delete(
      {
        where: {id},
      }
    ) 
  }

  
}
