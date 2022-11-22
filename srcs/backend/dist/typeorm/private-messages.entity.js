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
exports.PrivateMessage = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const message_entity_1 = require("./message.entity");
let PrivateMessage = class PrivateMessage {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'bigint',
        name: 'message_id',
    }),
    (0, class_validator_1.Max)(1000000000000),
    __metadata("design:type", Number)
], PrivateMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => message_entity_1.Message),
    __metadata("design:type", message_entity_1.Message)
], PrivateMessage.prototype, "message", void 0);
PrivateMessage = __decorate([
    (0, typeorm_1.Entity)()
], PrivateMessage);
exports.PrivateMessage = PrivateMessage;
//# sourceMappingURL=private-messages.entity.js.map