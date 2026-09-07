// src/users/dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, MaxLength, Matches, IsStrongPassword } from 'class-validator';
import { passwordRegex } from 'src/common/some-regex';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email is not in a valid format.' })
  email! : string;

  @IsString()
  @MinLength(8, { message: 'The password must be at least 8 characters long' })
  @Matches( passwordRegex, {message: 'The password must contain uppercase letters, lowercase letters, and numbers.' })
  @IsStrongPassword({minLength: 8}, {message: "The password must be at least 8 characters long" })
  password !: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name !: string;
}
