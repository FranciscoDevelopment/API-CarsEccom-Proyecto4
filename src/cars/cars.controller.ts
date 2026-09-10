import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { ApiKeyGuard } from 'src/common/guards/api-key/api-key.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RoleEnum } from 'src/auth/types/role.type';


@Controller( {path: 'cars', version: '1' } )
export class CarsController {

  constructor(private readonly carsService: CarsService) {}

  @Auth(RoleEnum.ADMIN)
  @Post()
  //@UseGuards( ApiKeyGuard )
  async create(@Body() createCarDto: CreateCarDto) {
    return await this.carsService.create(createCarDto);
  }

  @Get()
  async findWithPagination( @Query() pagination : PaginationQueryDto ) {
    return await this.carsService.findWithPagination( pagination.page, pagination.pageSize )
  }

  @Get('all')
  findAll() {
    return this.carsService.findAll();
  }


  @Get( 'brand/:brand' )
  async findCarsByBrand( @Param('brand') brand : string ) {
    return await this.carsService.findCarsByBrand( brand ) 
  }


  @Get( 'model/:model' )
  async findCarsByModel( @Param('model') model : string ) {
    return await this.carsService.findCarsByModel(model)
  }


  @Get( 'version/:version' )
  async findCarsByVersion( @Param('version') version : string ) {

    return await this.carsService.findCarsByVersion( version )

  }


  @Get( 'greater/:min' )
  async findCarsByGreaterPriceThan( @Param('min') minPrice : number  ){

    return await this.carsService.findCarsByGreaterPriceThan( minPrice )

  }

  @Get( 'lower/:max' )
  async findCarsByLowerPriceThan( @Param('max') maxPrice : number ) {

    return await this.carsService.findCarsByLowerPriceThan( maxPrice )

  }


  @Get('out-stock')
  async findCarsWithoutStock() {
    return this.carsService.findCarsWithoutStock() ;
  }

  @Get('available')
  async findAvailableCars() {
    return this.carsService.findAvailableCars() ;
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.carsService.findOneById(+id);
  }


  @Auth( RoleEnum.ADMIN )
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(+id, updateCarDto);
  }


  @Auth( RoleEnum.ADMIN )
  @Delete('version/:version')
  removeCarsWithOutStock( @Param('version') version : string ) {
    return this.carsService.removeCarsWithOutStock(version)
  }


  @Auth( RoleEnum.ADMIN )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carsService.remove(+id);
  }


}
