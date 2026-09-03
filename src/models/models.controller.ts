import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModelsService } from './models.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';

@Controller({path: 'models', version: '1'})
export class ModelsController {

  constructor(private readonly modelsService: ModelsService) {}

  @Post()
  create(@Body() createModelDto: CreateModelDto) {
    return this.modelsService.create(createModelDto);
  }


  @Get()
  findAll() {
    return this.modelsService.findAll();
  }


  @Get( 'brand/:brand' )
  async findModelsByBrand( @Param('brand') brand : string ) {
  
    return await this.modelsService.findModelsByBrand(brand)
  
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modelsService.findOneById(+id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModelDto: UpdateModelDto) {
    return this.modelsService.update(+id, updateModelDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modelsService.remove(+id);
  }


}
