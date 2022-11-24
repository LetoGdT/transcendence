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
const channels_dto_2 = require("../dto/channels.dto");
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
    getChannelbanlist() {
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
    changeUserPermissions(channel_id, user_id, patchChannelUser, req) {
        return this.channelsService.updateChannelUser(channel_id, user_id, req.user, patchChannelUser.role);
    }
    leaveChannel(channel_id, user_id, req) {
        return this.channelsService.deleteChannelUser(channel_id, user_id, req.user);
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
    (0, common_1.Get)('/:channel_id/banlist'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "getChannelbanlist", null);
__decorate([
    (0, common_1.Patch)('/:channel_id'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Param)('channel_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, channels_dto_2.PatchChannelDto, Object]),
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
    __metadata("design:paramtypes", [Number, Number, Object, Object]),
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
ChannelsController = __decorate([
    (0, common_1.Controller)('channels'),
    __metadata("design:paramtypes", [channels_service_1.ChannelsService])
], ChannelsController);
exports.ChannelsController = ChannelsController;
//# sourceMappingURL=channels.controller.js.map