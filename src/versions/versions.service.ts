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


  update(id: number, updateVersionDto: UpdateVersionDto) {
    return `This action updates a #${id} version`;
  }


  remove(id: number) {
    return `This action removes a #${id} version`;
  }

}
