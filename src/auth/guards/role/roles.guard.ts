import { CanActivate, ExecutionContext, ForbiddenException, Injectable} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayloadT } from '../../types/jwt.types';
import { ROLES_KEY } from '../../decorators/roles.decorator';
import { RoleEnum } from '../../types/role.type';

/**
 * Guard de autorización por rol (RBAC).
 *
 * ⚠️ Depende de que el AuthGuard haya corrido antes y haya dejado el payload en
 * `request.user`. Por eso en app.module.ts el AuthGuard tiene que declararse ANTES
 * que el RolesGuard en el array de providers: con APP_GUARD, los guards corren en el
 * orden en que los declarás.
 */
@Injectable()
export class RolesGuard implements CanActivate {
    
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext) : boolean {
        
        const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Si el endpoint no pide ningún rol, no es asunto de este guard.
        // Esto es lo que permite registrarlo globalmente sin romper el resto de la app.
        if (!requiredRoles || requiredRoles.length === 0) return true;

        const { user } = context.switchToHttp().getRequest<{ user?: JwtPayloadT }>();

        if (!user) {
            // Llegar acá significa que el AuthGuard no corrió: error de configuración
            throw new ForbiddenException('The user could not be determined.');
        }

        const hasPermission = requiredRoles.includes(user.role as RoleEnum);
        
        if (!hasPermission) {
            // 403, NO 401: sabemos quién sos, pero no podés.
            throw new ForbiddenException('You do not have permission to perform this action.');
        }

        return true;
  
    }
}
