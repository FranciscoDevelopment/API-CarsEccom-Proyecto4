import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateCarDto {

    @IsNotEmpty( {message: "The brand is required"} )
    @IsString( {message: "The value is not valid"} )
    brand! : string ;

    @IsNotEmpty( {message: "The model name is required"} )
    @IsString( {message: "The value is not valid"} )
    model_name! : string ;

    @IsNotEmpty( {message: "The version name is required"} )
    @IsString( {message: "The value is not valid"} )
    version_name! : string ;

    @IsNotEmpty({message: "The price is required"})
    @IsNumber({maxDecimalPlaces: 2}, {message: "The price is not valid"})
    price! : number

    @IsNotEmpty( {message: "The product stock inventory is required"} )
    @IsNumber( {maxDecimalPlaces: 0}, {message: "The stock inventory is not valid"} )
    @Type( () => Number )
    inventory! : number

    @IsNotEmpty( {message: "The gear count is required"} )
    @IsInt( {message: "The gear count is not valid"} )
    @Min( 1, {message: "The gear count must be at least 1"} )
    gear_count! : number ;

    @IsNotEmpty( {message: "The seats amount is required"} )
    @IsInt( {message: "The seats amount is not valid"} )
    @Min( 2, {message: "The seats amount must be at least 2"} )
    @Max( 8, {message: "The seats quantity suppears the available limit"} )
    seats! : number ;

    @IsNotEmpty( {message: "The year is required"} )
    @IsInt( {message: "The year is not valid"} )
    @Min( 1910, {message: "The year must be greater than or equal to 1910"} )
    year! : number ;

    @IsNotEmpty( {message: "The engine is required"} )
    @IsString( {message: "The value is not valid"} )
    engine! : string ;

    @IsNotEmpty( {message: "The color is required"} )
    @IsString( {message: "The value is not valid"} )
    color! : string ;
    
    @IsOptional()
    @IsString()
    image_url? : string


}
