import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {

    @IsEmail( {}, {message: "The email format is not valid"} )
    email! : string

    @IsString()
    @IsNotEmpty({message: "The password is required"})
    password! : string


}