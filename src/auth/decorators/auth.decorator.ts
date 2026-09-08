import { applyDecorators } from "@nestjs/common";
import { RoleEnum } from "../types/role.type";
import { Roles } from "./roles.decorator";

export function Auth( ...roles : RoleEnum[] ) {

    return applyDecorators( Roles( ...roles ) )

}