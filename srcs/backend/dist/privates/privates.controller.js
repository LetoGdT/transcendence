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
exports.PrivatesController = void 0;
const common_1 = require("@nestjs/common");
const messages_service_1 = require("../messages/messages.service");
const privates_service_1 = require("./privates.service");
const auth_interceptor_1 = require("../auth/auth.interceptor");
const page_options_dto_1 = require("../dto/page-options.dto");
const private_messages_dto_1 = require("../dto/private-messages.dto");
const query_filters_dto_1 = require("../dto/query-filters.dto");
const messages_dto_1 = require("../dto/messages.dto");
let PrivatesController = class PrivatesController {
    constructor(privatesService, messagesService) {
        this.privatesService = privatesService;
        this.messagesService = messagesService;
    }
    getPrivateMessages(pageOptionsDto, messageQueryFilterDto, userSelectDto, req) {
        return this.privatesService.getMessages(pageOptionsDto, messageQueryFilterDto, userSelectDto, req.user);
    }
    getPrivateMessagesAsSender(pageOptionsDto, messageQueryFilterDto, userSelectDto, req) {
        return this.privatesService.getMessages(pageOptionsDto, messageQueryFilterDto, userSelectDto, req.user, { as_sender: true });
    }
    getPrivateMessagesAsRecipient(pageOptionsDto, messageQueryFilterDto, userSelectDto, req) {
        return this.privatesService.getMessages(pageOptionsDto, messageQueryFilterDto, userSelectDto, req.user, { as_recipient: true });
    }
    getConversations(req) {
        return this.privatesService.getConversations(req.user);
    }
    createPrivateMessage(postPrivateDto, req) {
        return this.privatesService.createMessage(postPrivateDto, req.user);
    }
    createPrivateMessageFromRecipientName(recipient, body, req) {
        const postPrivateDto = { recipient_name: recipient, content: body.content };
        return this.privatesService.createMessage(postPrivateDto, req.user);
    }
    updatePrivateMessage(id, updateMessageDto, req) {
        return this.privatesService.updateMessage(id, updateMessageDto, req.user);
    }
    deletePrivateMessage(id, req) {
        return this.privatesService.deleteMessage(id, req.user);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_options_dto_1.PageOptionsDto,
        query_filters_dto_1.MessageQueryFilterDto,
        messages_dto_1.UserSelectDto, Object]),
    __metadata("design:returntype", Promise)
], PrivatesController.prototype, "getPrivateMessages", null);
__decorate([
    (0, common_1.Get)('/as_sender'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_options_dto_1.PageOptionsDto,
        query_filters_dto_1.MessageQueryFilterDto,
        messages_dto_1.UserSelectDto, Object]),
    __metadata("design:returntype", Promise)
], PrivatesController.prototype, "getPrivateMessagesAsSender", null);
__decorate([
    (0, common_1.Get)('/as_recipient'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_options_dto_1.PageOptionsDto,
        query_filters_dto_1.MessageQueryFilterDto,
        messages_dto_1.UserSelectDto, Object]),
    __metadata("design:returntype", Promise)
], PrivatesController.prototype, "getPrivateMessagesAsRecipient", null);
__decorate([
    (0, common_1.Get)('/conversations'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PrivatesController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [private_messages_dto_1.PostPrivateDto, Object]),
    __metadata("design:returntype", void 0)
], PrivatesController.prototype, "createPrivateMessage", null);
__decorate([
    (0, common_1.Post)('/:recipient'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Param)('recipient')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PrivatesController.prototype, "createPrivateMessageFromRecipientName", null);
__decorate([
    (0, common_1.Patch)('/:id'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, private_messages_dto_1.UpdateMessageDto, Object]),
    __metadata("design:returntype", void 0)
], PrivatesController.prototype, "updatePrivateMessage", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)(auth_interceptor_1.AuthInterceptor),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PrivatesController.prototype, "deletePrivateMessage", null);
PrivatesController = __decorate([
    (0, common_1.Controller)('privmsg'),
    __metadata("design:paramtypes", [privates_service_1.PrivatesService,
        messages_service_1.MessagesService])
], PrivatesController);
exports.PrivatesController = PrivatesController;
//# sourceMappingURL=privates.controller.js.map