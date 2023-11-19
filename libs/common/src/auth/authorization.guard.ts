import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(
        private reflector: Reflector
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [context.getClass(), context.getHandler()])
        const userRole = request.user.role;
        console.log(requiredRoles)
        console.log(request.user)
        if (!requiredRoles.includes(userRole)) return false;
        return true;
    }
}