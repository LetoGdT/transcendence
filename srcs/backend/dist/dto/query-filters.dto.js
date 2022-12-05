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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelQueryFilterDto = exports.MessageQueryFilterDto = exports.UserQueryFilterDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UserQueryFilterDto {
}
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(Number.MAX_SAFE_INTEGER),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UserQueryFilterDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UserQueryFilterDto.prototype, "uid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserQueryFilterDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserQueryFilterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserQueryFilterDto.prototype, "image_url", void 0);
exports.UserQueryFilterDto = UserQueryFilterDto;
class MessageQueryFilterDto {
}
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(Number.MAX_SAFE_INTEGER),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], MessageQueryFilterDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(Number.MAX_SAFE_INTEGER),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], MessageQueryFilterDto.prototype, "message_id", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], MessageQueryFilterDto.prototype, "start_at", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], MessageQueryFilterDto.prototype, "end_at", void 0);
exports.MessageQueryFilterDto = MessageQueryFilterDto;
class ChannelQueryFilterDto {
}
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(Number.MAX_SAFE_INTEGER),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ChannelQueryFilterDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)('^[ A-Za-z0-9_\\-!?]*$'),
    __metadata("design:type", String)
], ChannelQueryFilterDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['public', 'private', 'protected']),
    __metadata("design:type", String)
], ChannelQueryFilterDto.prototype, "status", void 0);
exports.ChannelQueryFilterDto = ChannelQueryFilterDto;
//# sourceMappingURL=query-filters.dto.js.map