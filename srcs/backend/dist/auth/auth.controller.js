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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const auth_service_1 = require("./auth.service");
const auth_exceptions_filter_1 = require("../filters/auth-exceptions.filter");
const users_service_1 = require("../users/users.service");
const auth_service_2 = require("./auth.service");
const jwt_guard_1 = require("../guards/jwt.guard");
const auth_interceptor_1 = require("./auth.interceptor");
let AuthController = class AuthController {
    constructor(http, configService, jwtService, usersService, authService) {
        this.http = http;
        this.configService = configService;
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.authService = authService;
        this.logger = new common_1.Logger(auth_service_1.Api42.name);
    }
    redirect(res) {
        let host = 'https://api.intra.42.fr/oauth/authorize';
        let uid = this.configService.get('UID');
        let secret = this.configService.get('SECRET');
        if (uid == undefined || secret == undefined)
            throw new common_1.HttpException('42API credentials not set. Did you forget to create .env ?', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        let redirect_uri = 'http://localhost:3000/callback';
        let state = (0, crypto_1.randomBytes)(32).toString("hex");
        this.state = state;
        let url = `${host}?client_id=${uid}&redirect_uri=${redirect_uri}&response_type=code&scope=public&state=${state}`;
        return {
            url: url
        };
    }
    async getCode(query, res, headers) {
        if (!query.code || !this.state)
            throw new common_1.HttpException('Forbidden', common_1.HttpStatus.FORBIDDEN);
        if (query.state != this.state)
            throw new common_1.HttpException('CSRF attempt detected !', common_1.HttpStatus.FORBIDDEN);
        let api = new auth_service_1.Api42();
        await api.setToken(query.code);
        if (!(await api.isTokenValid()))
            await api.refreshToken();
        let me = await api.get('/v2/me');
        const user = await this.usersService.addUser(me);
        const { access_token, refresh_token } = await this.authService.createTokens(user.id);
        res.cookie('access_token', access_token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
        });
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
        });
        return (res.redirect('/'));
    }
    async movies(req) {
        console.log(req.user);
        return 'salut';
    }
    logout(res, req) {
        this.usersService.updateOne(req.user.id, { refresh_expires: Date() });
        res.clearCookie('access_token', {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
        });
        res.clearCookie('refresh_token', {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
        });
        return (res.redirect('/'));
    }
};
__decorate([
    (0, common_1.Redirect)('', 302),
    (0, common_1.Get)('/log'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "redirect", null);
__decorate([
    (0, common_1.Get)('/callback'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCode", null);
__decorate([
    (0, common_1.Get)('/test'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UseFilters)(auth_exceptions_filter_1.RedirectToLoginFilter),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "movies", null);
__decorate([
    (0, common_1.Get)('/logout'),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService,
        jwt_1.JwtService,
        users_service_1.UsersService,
        auth_service_2.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map