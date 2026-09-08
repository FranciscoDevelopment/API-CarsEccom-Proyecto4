import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { hashingThePassword } from './hashing/hash-bcrypt';
import { createHash } from 'node:crypto';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService : UsersService,
    private readonly jwtService : JwtService,
    private readonly configService : ConfigService
  ) {}


  async register( registerUserDto : CreateUserDto ) {

    const user = await this.usersService.create( registerUserDto ) ;

    const tokens = await this.generateTokens( user.id, user.email, user.role )

  }

  
  
  private async generateTokens ( userId : string, email : string, role : string ) {

    const payload = {sub: userId, email, role } ;


    const [ access_token, refresh_token ] = await Promise.all([


      this.jwtService.signAsync( payload, {

        secret: this.configService.get<string>('JWT_SECRET'),

        expiresIn: this.expiresIn('JWT_EXPIRES_IN'),

      } )
      ,
      this.jwtService.signAsync( payload, {
        
        secret: this.configService.get('JWT_REFRESH_SECRET') ,
        
        expiresIn: this.expiresIn('JWT_REFRESH_EXPIRES_IN')

      } )
    ]);

    
    const hashedRefreshToken = await hashingThePassword( this.resume( refresh_token ) )

    await this.usersService.updateRefreshToken( userId, hashedRefreshToken ) ;

    return {
      access_token,
      refresh_token
    }

  }

  
  private resume( token : string ) {

    return createHash('sha256').update(token).digest('hex')

  }

  private expiresIn( key : 'JWT_EXPIRES_IN' | 'JWT_REFRESH_EXPIRES_IN' ) {

    return this.configService.get<string>(key) as JwtSignOptions['expiresIn']

  }

}
