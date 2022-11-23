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
exports.PatchChannelDto = exports.PostChannelDto = void 0;
const class_validator_1 = require("class-validator");
class PostChannelDto {
}
__decorate([
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)('^[ A-Za-z0-9_\\-!?]*$'),
    __metadata("design:type", String)
], PostChannelDto.prototype, "name", void 0);
exports.PostChannelDto = PostChannelDto;
class PatchChannelDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsAscii)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], PatchChannelDto.prototype, "password", void 0);
exports.PatchChannelDto = PatchChannelDto;
//# sourceMappingURL=channels.dto.js.map