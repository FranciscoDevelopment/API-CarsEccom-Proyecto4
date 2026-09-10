import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RoleEnum } from 'src/auth/types/role.type';
import { UserEntity } from './entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { JwtPayloadT } from 'src/auth/types/jwt.types';

@UseInterceptors( ClassSerializerInterceptor )
@Controller('users')
export class UsersController {
  
  constructor(private readonly usersService: UsersService) {}

  /*
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  */

  @Auth( RoleEnum.ADMIN )
  @Get()
  async findAll() {
    
    const users = await this.usersService.findAll() ;

    return users.map( (user) => new UserEntity( user ) )

  }


  @Get( 'me' )
  async getMe( @CurrentUser('sub') userId : string ) {

    return new UserEntity( await this.usersService.findOne(userId) )

  }


  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    
    return new UserEntity( await this.usersService.findOne( id ) )
  }


  @Patch(':id')
  @Auth( RoleEnum.ADMIN )
  async update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto, 
    @CurrentUser() user : JwtPayloadT 
  ) {

    return new UserEntity( await this.usersService.update( id, updateUserDto, user ) )
  }


  @Delete(':id')
  @Auth( RoleEnum.ADMIN )
  async remove( @Param('id', ParseUUIDPipe) id : string ) {

    return new UserEntity( await this.usersService.remove(id) ) 

  }


}
