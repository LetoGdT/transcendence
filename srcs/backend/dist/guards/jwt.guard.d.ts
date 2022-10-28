import { ExecutionContext } from "@nestjs/common";
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private readonly authService;
    private readonly usersService;
    private logger;
    constructor(authService: AuthService, usersService: UsersService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
