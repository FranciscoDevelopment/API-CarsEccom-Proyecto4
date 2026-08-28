import { IsNotEmpty, IsInt, Min, IsString } from "class-validator";

export class CreateVersionDto {

    @IsNotEmpty( {message: "The model id is required"} )
    @IsInt( {message: "The model id is not valid"} )
    @Min( 1, {message: "The model id must be at least 1"} )
    model_id! : number

    @IsNotEmpty( {message: "The brand is required"} )
    @IsString( {message: "The value is not valid"} )
    brand! : string

    @IsNotEmpty( {message: "The model name is required"} )
    @IsString( {message: "The value is not valid"} )
    model_name! : string

    @IsNotEmpty( {message: "The version name is required"} )
    @IsString( {message: "The value is not valid"} )
    name! : string


}
