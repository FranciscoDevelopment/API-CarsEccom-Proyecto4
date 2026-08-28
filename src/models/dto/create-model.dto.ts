import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateModelDto {

    @IsNotEmpty( {message: "The brand is required"} )
    @IsString( {message: "The value is not valid"} )
    brand! : string

    @IsNotEmpty( {message: "The model name is required"} )
    @IsString( {message: "The value is not valid"} )
    name! : string

}