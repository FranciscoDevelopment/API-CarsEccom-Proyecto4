import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VersionsService } from './versions.service';
import { CreateVersionDto } from './dto/create-version.dto';
import { UpdateVersionDto } from './dto/update-version.dto';

@Controller('versions')
export class VersionsController {
  constructor(private readonly versionsService: VersionsService) {}

  @Post()
  create(@Body() createVersionDto: CreateVersionDto) {
    return this.versionsService.create(createVersionDto);
  }

  @Get()
  findAll() {
    return this.versionsService.findAll();
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVersionDto: UpdateVersionDto) {
    return this.versionsService.update(+id, updateVersionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.versionsService.remove(+id);
  }
}
