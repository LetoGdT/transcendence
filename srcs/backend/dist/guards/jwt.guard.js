"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JwtAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const users_service_1 = require("../users/users.service");
const auth_service_1 = require("../auth/auth.service");
let JwtAuthGuard = JwtAuthGuard_1 = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(authService, usersService) {
        super();
        this.authService = authService;
        this.usersService = usersService;
        this.logger = new common_1.Logger(JwtAuthGuard_1.name);
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const cookie_options = {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
        };
        const accessToken = request === null || request === void 0 ? void 0 : request.cookies["access_token"];
        const isValidAccessToken = this.authService.verifyToken(accessToken);
        if (isValidAccessToken)
            return true;
        const refreshToken = await request.cookies['refresh_token'];
        if (!refreshToken)
            throw new common_1.UnauthorizedException('Refresh token is not set');
        const user = await this.usersService.getOneByRefresh(refreshToken);
        if (!user)
            throw new common_1.UnauthorizedException('Refresh token is not valid');
        const expires = new Date(user.refresh_expires);
        const today = new Date();
        if (!user || refreshToken != user.refresh_token || expires < today)
            throw new common_1.UnauthorizedException('Refresh token is not valid');
        const { access_token: newAccessToken, refresh_token: newRefreshToken, } = await this.authService.createTokens(user.id);
        request.cookies['access_token'] = newAccessToken;
        request.cookies['refresh_token'] = newRefreshToken;
        response.cookie('access_token', newAccessToken, cookie_options);
        response.cookie('refresh_token', newRefreshToken, cookie_options);
        return true;
    }
};
JwtAuthGuard = JwtAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;
//# sourceMappingURL=jwt.guard.js.map