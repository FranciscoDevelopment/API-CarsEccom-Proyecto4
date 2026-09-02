import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { ApiKeyGuard } from 'src/common/guards/api-key/api-key.guard';

@Controller( {path: 'cars', version: '1' } )
export class CarsController {

  constructor(private readonly carsService: CarsService) {}

  @Post()
  //@UseGuards( ApiKeyGuard )
  async create(@Body() createCarDto: CreateCarDto) {
    return await this.carsService.create(createCarDto);
  }

  @Get()
  findAll() {
    return this.carsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(+id, updateCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carsService.remove(+id);
  }
}
