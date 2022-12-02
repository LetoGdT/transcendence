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
exports.Channel = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const message_entity_1 = require("./message.entity");
const channel_user_entity_1 = require("./channel-user.entity");
const channel_ban_entity_1 = require("../typeorm/channel-ban.entity");
let Channel = class Channel {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'bigint',
        name: 'channel_id',
    }),
    __metadata("design:type", Number)
], Channel.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)('^[ A-Za-z0-9_\\-!?]*$'),
    (0, typeorm_1.Column)({
        nullable: false,
        unique: true,
    }),
    __metadata("design:type", String)
], Channel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => channel_user_entity_1.ChannelUser, (channelUser) => channelUser.channel, {
        eager: true,
        onDelete: 'CASCADE',
        cascade: true
    }),
    __metadata("design:type", Array)
], Channel.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, (message) => message.channel, { cascade: true, eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Channel.prototype, "messages", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['public', 'private', 'protected']),
    (0, typeorm_1.Column)({
        default: 'private',
    }),
    __metadata("design:type", String)
], Channel.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => channel_ban_entity_1.ChannelBan, (channelBan) => channelBan.channel, {
        eager: true,
        onDelete: 'CASCADE',
        cascade: true
    }),
    __metadata("design:type", Array)
], Channel.prototype, "banlist", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, class_validator_1.IsAscii)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(40),
    (0, typeorm_1.Column)({
        nullable: true,
        unique: false,
    }),
    __metadata("design:type", String)
], Channel.prototype, "password", void 0);
Channel = __decorate([
    (0, typeorm_1.Entity)()
], Channel);
exports.Channel = Channel;
//# sourceMappingURL=channel.entity.js.map