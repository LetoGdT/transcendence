"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const messages_module_1 = require("../messages/messages.module");
const channels_controller_1 = require("./channels.controller");
const channels_service_1 = require("./channels.service");
const channel_entity_1 = require("../typeorm/channel.entity");
const channel_user_entity_1 = require("../typeorm/channel-user.entity");
const channel_ban_entity_1 = require("../typeorm/channel-ban.entity");
let ChannelsModule = class ChannelsModule {
};
ChannelsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([channel_entity_1.Channel, channel_user_entity_1.ChannelUser, channel_ban_entity_1.ChannelBan]),
            auth_module_1.AuthModule, messages_module_1.MessagesModule],
        controllers: [channels_controller_1.ChannelsController],
        providers: [channels_service_1.ChannelsService]
    })
], ChannelsModule);
exports.ChannelsModule = ChannelsModule;
//# sourceMappingURL=channels.module.js.map