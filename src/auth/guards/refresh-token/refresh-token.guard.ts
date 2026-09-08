import {CanActivate,ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtPayloadT } from 'src/auth/types/jwt.types';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  

  constructor(
    private readonly jwtService : JwtService,
    private readonly configService : ConfigService
  ) {}


  async canActivate(context: ExecutionContext) :  Promise<boolean> {

    const request = context.switchToHttp().getRequest<Request>() ;


    const [ type, token ] = request.headers.authorization?.split(' ') ?? [] ;


    if( type !== 'Bearer' || !token ) throw new UnauthorizedException('Refresh Token is required') ;

    try{
        
        const payload = await this.jwtService.verifyAsync<JwtPayloadT>( token, {

            secret: this.configService.get<string>('JWT_REFRESH_SECRET')

        } )

        request['user'] = payload ;

        request['refreshToken'] = token

    }
    catch{
        throw new UnauthorizedException('Refresh token invalid or expired')
    }
      

    return true

  }

}
