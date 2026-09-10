import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request} from 'express'
import { JwtPayloadT } from 'src/auth/types/jwt.types';
import { IS_PUBLIC_KEY } from 'src/auth/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService : JwtService,
    private readonly configService : ConfigService,
    private readonly reflector : Reflector
  ) {}


  async canActivate( context : ExecutionContext ) {

    const isPublic = this.reflector.getAllAndOverride<boolean>( IS_PUBLIC_KEY, [

      context.getHandler() ,
      context.getClass()

    ] )


    if(isPublic) return true ;


    const request = context.switchToHttp().getRequest<Request>()

    const token = this.extractTokenFromHeader( request ) ;

    if( !token ) throw new UnauthorizedException('Access Token is required') ;


    try {
     
      const payload = await this.jwtService.verifyAsync<JwtPayloadT>( token, {

        secret: this.configService.get<string>('JWT_SECRET')

      } ) ;

      request['user'] = payload ;

    } 
    catch {
      throw new UnauthorizedException('Invalid or expired Token')
    }


    return true

  }


  private extractTokenFromHeader( request : Request ) : string | undefined {

    const [type, token] = request.headers.authorization?.split(' ') ?? [] ;


    return type === 'Bearer'  ?  token  :  undefined ;

  }


}
