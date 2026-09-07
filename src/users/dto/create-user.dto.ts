// src/users/dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, MaxLength, Matches, IsStrongPassword, maxLength } from 'class-validator';
import { passwordRegex } from 'src/common/some-regex';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email is not in a valid format.' })
  email! : string;

  @IsString()
  @MinLength(8, { message: 'The password must be at least 8 characters long' })
  @MaxLength( 72, {message: 'The password is too long'} )
  @Matches( passwordRegex, {message: 'The password must contain uppercase letters, lowercase letters, and numbers.' })
  @IsStrongPassword({minLength: 8}, {message: "The password must be at least 8 characters long" })
  password !: string;

  @IsString()
  @MinLength(2, {message: 'The name must contain at least 2 characters'})
  @MaxLength(50, {message: 'The name is too long'})
  name !: string;
}
