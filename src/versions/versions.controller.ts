import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VersionsService } from './versions.service';
import { CreateVersionDto } from './dto/create-version.dto';
import { UpdateVersionDto } from './dto/update-version.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RoleEnum } from 'src/auth/types/role.type';

@Controller({path: 'versions', version: '1'})
export class VersionsController {

  constructor(private readonly versionsService: VersionsService) {}

  
  @Auth( RoleEnum.ADMIN )
  @Post()
  create(@Body() createVersionDto: CreateVersionDto) {
    return this.versionsService.create(createVersionDto);
  }

  
  @Get()
  async findWithPagination( @Query() pagination : PaginationQueryDto ) {
    
    return await this.versionsService.findWithPagination( pagination.page, pagination.pageSize )
    
  }
  
  
  @Get('all')
  findAll() {
    return this.versionsService.findAll();
  }
  

  @Get('count')
  async findAllVersionsWithCarsCounter() {

    return await this.versionsService.findAllVersionsWithCarsCounter()

  }


  @Get('brand/:brand')
  async findVersionsByBrand( @Param('brand') brand : string ) {

    return await this.versionsService.findVersionsByBrand( brand )

  }


  @Get('version/:version')
  async findVersionsByModel( @Param('model') model : string ) {

    return await this.versionsService.findVersionsByModel(model)

  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.versionsService.findOne(+id);
  }


  @Auth( RoleEnum.ADMIN )
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateVersionDto: UpdateVersionDto) {
    return await this.versionsService.update(+id, updateVersionDto);
  }


  @Auth( RoleEnum.ADMIN )
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.versionsService.remove(+id);
  }


}
