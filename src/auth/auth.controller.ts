import { Controller, Get, Post, Body, UseGuards, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RefreshTokenGuard } from './guards/refresh-token/refresh-token.guard';
import { LoginDto } from './dto/login.dto';
import { JwtPayloadT } from './types/jwt.types';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller({path: 'auth', version: '1'})
export class AuthController {
  
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register( @Body() registerUserDto : CreateUserDto ) {

    return await this.authService.register(registerUserDto)
  }


  @Public()
  @Post('login')
  @HttpCode( HttpStatus.OK )
  async login( @Body() loginUserDto : LoginDto ) {
    return await this.authService.login(loginUserDto)
  }


  @Public()
  @UseGuards( RefreshTokenGuard )
  @Post( 'refresh' )
  @HttpCode( HttpStatus.OK )
  async refresh( @Req() req : Request ) {
    
    const user = req['user'] as JwtPayloadT ;

    const refreshToken = req['refreshToken'] as string ;


    return await this.authService.refresh( user.sub, refreshToken )
  }


  @Post('logout')
  @HttpCode( HttpStatus.NO_CONTENT )
  async logout( @CurrentUser('sub') userId : string ) {

    return await this.authService.logout( userId )
  }


}
