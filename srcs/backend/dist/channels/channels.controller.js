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
exports.ChannelsController = void 0;
const common_1 = require("@nestjs/common");
const channels_service_1 = require("./channels.service");
const auth_interceptor_1 = require("../auth/auth.interceptor");
const page_options_dto_1 = require("../dto/page-options.dto");
const channels_dto_1 = require("../dto/channels.dto");
const private_messages_dto_1 = require("../dto/private-messages.dto");
const query_filters_dto_1 = require("../dto/query-filters.dto");
const messages_dto_1 = require("../dto/messages.dto");
let ChannelsController = class ChannelsController {
    constructor(channelsService) {
        this.channelsService = channelsService;
    }
    getChannels(pageOptionsDto, req) {
        return this.channelsService.getChannels(pageOptionsDto, req.user);
    }
    createChannel(postChannelDto, req) {
        return this.channelsService.createChannel(postChannelDto, req.user);
    }
    updateChannel(channel_id, patchChannelDto, req) {
        return this.channelsService.updateChannel(channel_id, patchChannelDto, req.user);
    }
    getChannelUsers(pageOptionsDto, channel_id, req) {
        return this.channelsService.getChannelUsers(pageOptionsDto, channel_id, req.user);
    }
    joinChannel(channel_id, body, req) {
        return this.channelsService.joinChannel(channel_id, req.user, body.password);
    }
    changeUserPermissions(channel_id, user_id, patchChannelUserDto, req) {
        return this.channelsService.updateChannelUser(channel_id, user_id, req.user, patchChannelUserDto.role);
    }
    leaveChannel(channel_id, user_id, req) {
        return this.channelsService.deleteChannelUser(channel_id, user_id, req.user);
    }
    getChannelMessages(channel_id, pageOptionsDto, messageQueryFilterDto, userSelectDto, req) {
        return this.channelsService.getChannelMessages(channel_id, pageOptionsDto, messageQueryFilterDto, userSelectDto, req.user);
    }
    getChannelMessagesAsSender(channel_id, pageOptionsDto, messageQueryFilterDto, userSelectDto, req) {
        return this.channelsService.getChannelMessages(channel_id, pageOptionsDto, messageQueryFilterDto, userSelectDto, req.user, true);
    }
    createChannelMessage(channel_id, postPrivateDto, req) {
        return this.channelsService.createChannelMessage(channel_id, postPrivateDto, req.user);
    }
    updateChannelMessage(channel_id, message_id, updateMessageDto, req) {
        return this.channelsService.updateChannelMessage(channel_id, message_id, updateMessageDto, req.user);
    }
    deleteChannelMessage(channel_id, message_id, req) {
        return this.channelsService.deleteChannelMessage(channel_id, message_id, req.user);
    }
    getConversations() {
    }
    getChannelbanlist() {
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_options_dto_1.PageOptionsDto, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getChannels", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channels_dto_1.PostChannelDto, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "createChannel", null);
__decorate([
    (0, common_1.Patch)('/:channel_id'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Param)('channel_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, channels_dto_1.PatchChannelDto, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "updateChannel", null);
__decorate([
    (0, common_1.Get)('/:channel_id/users'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Param)('channel_id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_options_dto_1.PageOptionsDto, Number, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getChannelUsers", null);
__decorate([
    (0, common_1.Post)('/:channel_id/users'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Param)('channel_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "joinChannel", null);
__decorate([
    (0, common_1.Patch)('/:channel_id/users/:user_id'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Param)('channel_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('user_id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, channels_dto_1.PatchChannelUserDto, Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "changeUserPermissions", null);
__decorate([
    (0, common_1.Delete)('/:channel_id/users/:user_id'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Param)('channel_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('user_id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "leaveChannel", null);
__decorate([
    (0, common_1.Get)('/:channel_id/messages'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Param)('channel_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, page_options_dto_1.PageOptionsDto,
        query_filters_dto_1.MessageQueryFilterDto,
        messages_dto_1.UserSelectDto, Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "getChannelMessages", null);
__decorate([
    (0, common_1.Get)('/:channel_id/messages/as_sender'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Param)('channel_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, page_options_dto_1.PageOptionsDto,
        query_filters_dto_1.MessageQueryFilterDto,
        messages_dto_1.UserSelectDto, Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "getChannelMessagesAsSender", null);
__decorate([
    (0, common_1.Post)('/:channel_id/messages'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Param)('channel_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, private_messages_dto_1.PostPrivateDto, Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "createChannelMessage", null);
__decorate([
    (0, common_1.Patch)('/:channel_id/messages/:message_id'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Param)('channel_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('message_id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, private_messages_dto_1.UpdateMessageDto, Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "updateChannelMessage", null);
__decorate([
    (0, common_1.Delete)('/:channel_id/messages/:message_id'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Param)('channel_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('message_id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "deleteChannelMessage", null);
__decorate([
    (0, common_1.Get)('/conversations'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)('/:channel_id/banlist'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "getChannelbanlist", null);
ChannelsController = __decorate([
    (0, common_1.Controller)('channels'),
    __metadata("design:paramtypes", [channels_service_1.ChannelsService])
], ChannelsController);
exports.ChannelsController = ChannelsController;
//# sourceMappingURL=channels.controller.js.map