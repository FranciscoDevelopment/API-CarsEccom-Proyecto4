import { Exclude } from "class-transformer";



export class UserEntity {

    id! : string 

    email! : string ;

    name! : string;

    role! : string ;

    createdAt! : Date ;

    updatedAt! : Date


    @Exclude()
    password? : string ;

    @Exclude()
    hashedRefreshToken? : string | null;


    constructor( partial : Partial< UserEntity > ) {
        
        Object.assign( this, partial )

    }

}
