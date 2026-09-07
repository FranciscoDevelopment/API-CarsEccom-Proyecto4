export type userRowT = {

    email : string ;
    
    password? : string ;

    name : string ;

    role : string ;
    
    createdAt : Date ;
    
    updatedAt : Date
    
    hashedRefreshToken? : string | null;
    

}

export type userVerificationT = Pick<userRowT, 'email'>
