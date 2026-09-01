import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  
  canActivate(context: ExecutionContext ): boolean { //| Promise<boolean> | Observable<boolean> {
    
    const request = context.switchToHttp().getRequest<Request>() ;

    const apiKey = request.headers.get('x-api-key') ;

    if( apiKey !== ( process.env.API_KEY ?? 'f1-2026-secret' ) ) {

      throw new UnauthorizedException( "Invalid or missing API key" )

    }
    
    return true;

    
  }


}
