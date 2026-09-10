import * as bcrypt from 'bcrypt';

/*
const saltRounds = 10 ;

const hash = await bcrypt.hash( 'myPassword', saltRounds ) ;

const coincide = await bcrypt.compare( 'myPassword', hash ) ;

const noCoincide = await bcrypt.compare( 'myPasword', hash ) ;

*/

export const hashingThePassword = async ( certainPassword : string ) => {

    const salt = await bcrypt.genSalt(10) ;

    return await bcrypt.hash( certainPassword, salt )

}


export const checkTheRespectivePassword = async ( loginInputPassword : string , respectiveRegisteredUserPassword : string ) => {

    return await bcrypt.compare( loginInputPassword, respectiveRegisteredUserPassword )

}