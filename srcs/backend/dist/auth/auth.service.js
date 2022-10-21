"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Api42_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api42 = exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let AuthService = class AuthService {
};
AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
exports.AuthService = AuthService;
let Api42 = Api42_1 = class Api42 {
    constructor() {
        this.logger = new common_1.Logger(Api42_1.name);
        this.http = new axios_1.HttpService();
        this.configService = new config_1.ConfigService;
    }
    async setToken(auth_code) {
        const checkResultObservable = this.http.post('https://api.intra.42.fr/oauth/token', {
            grant_type: 'authorization_code',
            client_id: this.configService.get('UID'),
            client_secret: this.configService.get('SECRET'),
            redirect_uri: 'http://localhost:3000/callback',
            code: auth_code
        });
        const checkResult = await (await (0, rxjs_1.lastValueFrom)(checkResultObservable)).data;
        this.token = checkResult.access_token;
        this.refresh = checkResult.refresh_token;
    }
    async refreshToken() {
        const refresh = this.http.post('https://api.intra.42.fr/oauth/token', {
            grant_type: 'refresh_token',
            refresh_token: this.refresh,
            client_id: this.configService.get('UID'),
            client_secret: this.configService.get('SECRET')
        });
        const refreshJson = await (await (0, rxjs_1.lastValueFrom)(refresh)).data;
        this.token = refreshJson.access_token;
        this.refresh = refreshJson.refresh_token;
    }
    async isTokenValid() {
        let info = await this.get('/oauth/token/info');
        if (info.error)
            return false;
        return true;
    }
    async get(endpoint) {
        if (!this.token)
            return null;
        const headersRequest = {
            'Authorization': `Bearer ${this.token}`
        };
        const ret = this.http.get('https://api.intra.42.fr/' + endpoint, { headers: headersRequest });
        return (await (await (0, rxjs_1.lastValueFrom)(ret)).data);
    }
};
Api42 = Api42_1 = __decorate([
    (0, common_1.Injectable)()
], Api42);
exports.Api42 = Api42;
//# sourceMappingURL=auth.service.js.map