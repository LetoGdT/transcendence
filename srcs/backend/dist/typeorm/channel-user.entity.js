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
exports.ChannelUser = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const user_entity_1 = require("./user.entity");
const channel_entity_1 = require("./channel.entity");
let ChannelUser = class ChannelUser {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'bigint',
        name: 'channelUser_id',
    }),
    __metadata("design:type", Number)
], ChannelUser.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], ChannelUser.prototype, "user", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['None', 'Admin', 'Owner']),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChannelUser.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => channel_entity_1.Channel, (channel) => channel.users, { onDelete: 'CASCADE' }),
    __metadata("design:type", channel_entity_1.Channel)
], ChannelUser.prototype, "channel", void 0);
ChannelUser = __decorate([
    (0, typeorm_1.Entity)()
], ChannelUser);
exports.ChannelUser = ChannelUser;
//# sourceMappingURL=channel-user.entity.js.map