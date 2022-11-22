"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_config_1 = require("./jwt.config");
const jwt_strategy_1 = require("./jwt.strategy");
const users_module_1 = require("../users/users.module");
const user_entity_1 = require("../typeorm/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const auth_interceptor_1 = require("./auth.interceptor");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            axios_1.HttpModule,
            jwt_1.JwtModule.registerAsync(jwt_config_1.jwtConfig),
            config_1.ConfigModule
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, auth_interceptor_1.AuthInterceptor],
        exports: [auth_service_1.AuthService, auth_interceptor_1.AuthInterceptor]
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map