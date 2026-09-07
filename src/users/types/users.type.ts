export type userRowT = {

    email : string ;
    
    password : string ;

    name : string

}

export type userVerificationT = Pick<userRowT, 'email'>
