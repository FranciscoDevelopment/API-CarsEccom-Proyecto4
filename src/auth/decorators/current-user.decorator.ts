import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayloadT } from "../types/jwt.types";

type userPayloadT = {
    user? : JwtPayloadT
}

export const CurrentUser = createParamDecorator(

    (data : keyof JwtPayloadT | undefined, context : ExecutionContext) => {

        const request = context.switchToHttp().getRequest<userPayloadT>() ;

        const user = request.user 


        return data  ?  user?.[data]  :  user

    }

)