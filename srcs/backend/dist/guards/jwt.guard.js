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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
let JwtAuthGuard = JwtAuthGuard_1 = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(authService, userService) {
        super();
        this.authService = authService;
        this.userService = userService;
        this.logger = new common_1.Logger(JwtAuthGuard_1.name);
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const cookie_options = {
            maxAge: 30000,
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
        };
        try {
            const accessToken = passport_jwt_1.ExtractJwt.fromExtractors([(request) => {
                    let data = request === null || request === void 0 ? void 0 : request.cookies["auth_cookie"];
                    if (!data) {
                        return null;
                    }
                    console.log(data);
                    return data;
                }]);
            if (!accessToken)
                throw new common_1.UnauthorizedException('Access token is not set');
            const isValidAccessToken = this.authService.validateToken(accessToken);
            if (isValidAccessToken)
                return this.activate(context);
            const refreshToken = request.cookies['refresh_token'];
            if (!refreshToken)
                throw new common_1.UnauthorizedException('Refresh token is not set');
            const isValidRefreshToken = this.authService.validateToken(refreshToken);
            if (!isValidRefreshToken)
                throw new common_1.UnauthorizedException('Refresh token is not valid');
            const user = await this.userService.getByRefreshToken(refreshToken);
            const { accessToken: newAccessToken, refreshToken: newRefreshToken, } = this.authService.createTokens(user.id);
            await this.userService.updateRefreshToken(user.id, newRefreshToken);
            request.cookies['access_token'] = newAccessToken;
            request.cookies['refresh_token'] = newRefreshToken;
            response.cookie('access_token', newAccessToken, cookie_options);
            response.cookie('refresh_token', newRefreshToken, cookie_options);
            return this.activate(context);
        }
        catch (err) {
            this.logger.error(err.message);
            response.clearCookie('access_token', cookie_options);
            response.clearCookie('refresh_token', cookie_options);
            return false;
        }
    }
    async activate(context) {
        return super.canActivate(context);
    }
    handleRequest(err, user) {
        if (err || !user) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
JwtAuthGuard = JwtAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof AuthService !== "undefined" && AuthService) === "function" ? _a : Object, typeof (_b = typeof UserService !== "undefined" && UserService) === "function" ? _b : Object])
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;
//# sourceMappingURL=jwt.guard.js.map