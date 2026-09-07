import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashingThePassword } from 'src/auth/hashing/hash-bcrypt';
import { userVerificationT } from './types/users.type';
import { JwtPayloadT } from 'src/auth/types/jwt.types';
import { RoleEnum } from 'src/auth/types/role.type';


const SELECT_PUBLIC = {
  //id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true
} as const

@Injectable()
export class UsersService {
  
  constructor( private readonly prismaORM : PrismaService ) {}

  
  async create(createUserDto: CreateUserDto) {
    
    const existingUser = await this.prismaORM.user.findFirst(
      {
        where: createUserDto as userVerificationT,
        select: {id: true }
      }
    )
    
    if( existingUser ) {
      let errors: string[] = [];
      
      errors.push(`User with email "${createUserDto.email}" is already login"`);
      
      throw new ConflictException(errors);
    }
    

    const hash = await hashingThePassword( createUserDto.password ) ;


    return this.prismaORM.user.create(
      {
        data: {
          ...createUserDto,
          password: hash,
        },
        select: SELECT_PUBLIC
      }
    )

  }


  findAll() {
    return this.prismaORM.user.findMany(
      {
        select: SELECT_PUBLIC,
        orderBy: {createdAt: 'asc'}
      }
    )
  }


  async findOne(id : string) {
    
    const user = await this.prismaORM.user.findUnique(
      {
        where: {id},
        select: SELECT_PUBLIC
      }
    )

    if( !user ) throw new NotFoundException('User not founded') ;


    return user ;

  }


  // Búsqueda normal: NO trae el password. Es la que usa el resto de la app
  findByEmail ( email : string ) {

    return this.prismaORM.user.findUnique(
      {
        where: {email},
        select: SELECT_PUBLIC
      }
    )

  }


  // ⚠️ Este SÍ trae el password: lo necesita el login para comparar con bcrypt.
  findByEmailWithPassword ( email : string ) {

    return this.prismaORM.user.findUnique(
      {
        where: {email}
      }
    )

  }


  // Uso interno del flujo de refresh token.
  findByIdWithRefreshToken( id : string ) {

    return this.prismaORM.user.findUnique(
      {
        where: {id},
        select: {
          ...SELECT_PUBLIC,
          hashedRefreshToken: true
        }
      }
    )

  }


  // Guarda bcrypt(refresh_token), o null para matar la sesión (logout / reuso).
  async updateRefreshToken( userId : string, hashedRefreshToken : string ) {

    await this.prismaORM.user.update(
      {
        where: {id: userId},
        data: {hashedRefreshToken: hashedRefreshToken},
        select: {id: true}
      }
    )

  }


  async update(id: string, updateUserDto: UpdateUserDto, requester : JwtPayloadT ) {
    
    const isSelf = requester.sub === id ;

    const isAdmin = ( requester.role as RoleEnum ) === RoleEnum.ADMIN ;


    if( !isSelf && !isAdmin ) {

      throw new ForbiddenException('Only can edit your own profile')

    }


    await this.findOne(id) ;


    if( updateUserDto.email ) {

      const inUsing = await this.prismaORM.user.findUnique(
        {
          where: {email: updateUserDto.email},
          select: {id: true}
        }
      )
    
      if( inUsing && inUsing.id !== id ) throw new ConflictException('Already exist an user with that email') ;
     
    }
    
        
    return this.prismaORM.user.update(
      {
        where: {id},
        data: updateUserDto,
        select: SELECT_PUBLIC
      }
    )
    

  }


  async remove(id: string) {
    
    await this.findOne(id) ;

    return this.prismaORM.user.delete(
      {
        where: {id},
        select: SELECT_PUBLIC
      }
    )

  }


}
