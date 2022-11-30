"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const user_entity_1 = require("./typeorm/user.entity");
const message_entity_1 = require("./typeorm/message.entity");
const private_message_entity_1 = require("./typeorm/private-message.entity");
const channel_entity_1 = require("./typeorm/channel.entity");
const channel_user_entity_1 = require("./typeorm/channel-user.entity");
const channel_ban_entity_1 = require("./typeorm/channel-ban.entity");
const messages_module_1 = require("./messages/messages.module");
const privates_module_1 = require("./privates/privates.module");
const channels_module_1 = require("./channels/channels.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: +configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    entities: [user_entity_1.User, message_entity_1.Message, private_message_entity_1.PrivateMessage, channel_entity_1.Channel, channel_user_entity_1.ChannelUser, channel_ban_entity_1.ChannelBan,],
                    synchronize: true,
                }),
                inject: [config_1.ConfigService],
            }),
            messages_module_1.MessagesModule,
            privates_module_1.PrivatesModule,
            channels_module_1.ChannelsModule
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map