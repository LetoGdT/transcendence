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
const page_options_dto_1 = require("../dto/page-options.dto");
const auth_interceptor_1 = require("../auth/auth.interceptor");
let PrivatesController = class PrivatesController {
    constructor(privatesService, messagesService) {
        this.privatesService = privatesService;
        this.messagesService = messagesService;
    }
    getPrivateMessages(pageOptionsDto, req) {
    }
    createPrivateMessage() {
        return null;
    }
    updatePrivateMessage() {
        return null;
    }
    deletePrivateMessage() {
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
    __metadata("design:returntype", void 0)
], PrivatesController.prototype, "getPrivateMessages", null);
__decorate([
    (0, common_1.Post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PrivatesController.prototype, "createPrivateMessage", null);
__decorate([
    (0, common_1.Patch)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PrivatesController.prototype, "updatePrivateMessage", null);
__decorate([
    (0, common_1.Delete)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PrivatesController.prototype, "deletePrivateMessage", null);
PrivatesController = __decorate([
    (0, common_1.Controller)('privmsg'),
    __metadata("design:paramtypes", [privates_service_1.PrivatesService,
        messages_service_1.MessagesService])
], PrivatesController);
exports.PrivatesController = PrivatesController;
//# sourceMappingURL=privates.controller.js.map