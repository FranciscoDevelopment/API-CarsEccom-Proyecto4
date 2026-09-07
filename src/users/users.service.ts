import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashingThePassword } from 'src/auth/hashing/hash-bcrypt';
import { userVerificationT } from './types/users.type';

@Injectable()
export class UsersService {
  
  constructor( private readonly prismaORM : PrismaService ) {}

  
  async create(createUserDto: CreateUserDto) {
    
    const hash = await hashingThePassword( createUserDto.password ) ;

    const existingUser = await this.prismaORM.user.findFirst(
      {
        where: createUserDto as userVerificationT
      }
    )


    if( existingUser ) {
      let errors: string[] = [];

      errors.push(`User with email "${createUserDto.email}" is already login"`);

      throw new ConflictException(errors);
    }


    return this.prismaORM.user.create(
      {
        data: {
          ...createUserDto,
          password: hash,
        }
      }
    )


  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
