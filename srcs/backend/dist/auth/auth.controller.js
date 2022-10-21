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
const crypto_1 = require("crypto");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(http) {
        this.http = http;
        this.logger = new common_1.Logger(auth_service_1.Api42.name);
        this.configService = new config_1.ConfigService;
    }
    redirect(res) {
        let host = 'https://api.intra.42.fr/oauth/authorize';
        let uid = this.configService.get('UID');
        let secret = this.configService.get('SECRET');
        let redirect_uri = 'http://localhost:3000/callback';
        let state = (0, crypto_1.randomBytes)(32).toString("hex");
        this.state = state;
        let url = `${host}?client_id=${uid}&redirect_uri=${redirect_uri}&response_type=code&scope=public&state=${state}`;
        return {
            url: url
        };
    }
    async getCode(query) {
        if (!query.code || !this.state || query.state != this.state)
            throw new common_1.HttpException('Forbidden', common_1.HttpStatus.FORBIDDEN);
        let api = new auth_service_1.Api42();
        await api.setToken(query.code);
        if (!(await api.isTokenValid()))
            await api.refreshToken();
        let me = await api.get('/v2/me');
        return (me.login);
    }
};
__decorate([
    (0, common_1.Redirect)('', 301),
    (0, common_1.Get)('/log'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "redirect", null);
__decorate([
    (0, common_1.Get)('/callback'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCode", null);
AuthController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map