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
    return await this.prismaORM.models.findMany()  
  }


  async findOneById(id: number) {
    
    const car = await this.prismaORM.models.findUnique(
      {
        where: {id}
      }
    )

    return car ;

  }

  async findModelsByBrand ( brand : string ) {

    const modelsByBrand = await this.prismaORM.models.findMany(
      {
        where: {brand: brand}
      }
    )

    return modelsByBrand

  }



  remove(id: number) {
    return `This action removes a #${id} model`;
  }

  
}
