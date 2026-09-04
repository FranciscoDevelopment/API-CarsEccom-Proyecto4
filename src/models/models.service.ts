import { ConflictException, Injectable } from '@nestjs/common';
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

    const errors : string[] = []

    const transaction$ = this.prismaORM.$transaction( async ( tx ) => {

      const model = await tx.versions.findFirstOrThrow(
        {
          where: {id}
        }
      )


      const carsCount = await tx.cars.count(
        {
          where: {
            model_name: model.name,
          }
        }
      )

      if( carsCount > 1 ) {

        errors.push(`Model '${model.name}' has more than 1 unit in stock and can't be deleted directly`)

        throw new ConflictException( errors )

      }


      const stock = await tx.cars.aggregate(

        {
          where: {
            model_name: model.name
          },
          _sum: {quantity: true}
        }

      )

      const totalUnitsInStock = stock._sum.quantity ?? 0 ;
      
      if(totalUnitsInStock > 1) {

        errors.push(`Model '${model.name}' has more than 1 unit in stock and can't be deleted directly`)

        throw new ConflictException(errors)
      }


      await tx.cars.deleteMany(
        {
          where: {
            model_name: model.name
          }
        }
      )


      return tx.models.delete(
        {
          where: {id}
        }
      )

    } )


    return transaction$

  }

  
}
