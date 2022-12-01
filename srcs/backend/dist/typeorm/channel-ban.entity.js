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
exports.ChannelBan = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const user_entity_1 = require("./user.entity");
const channel_entity_1 = require("./channel.entity");
let ChannelBan = class ChannelBan {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'bigint',
        name: 'channelUser_id',
    }),
    __metadata("design:type", Number)
], ChannelBan.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], ChannelBan.prototype, "user", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, typeorm_1.Column)({
        type: 'timestamptz',
        nullable: true,
        unique: false,
        default: null
    }),
    __metadata("design:type", Date)
], ChannelBan.prototype, "unban_date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => channel_entity_1.Channel, (channel) => channel.users, { onDelete: 'CASCADE' }),
    __metadata("design:type", channel_entity_1.Channel)
], ChannelBan.prototype, "channel", void 0);
ChannelBan = __decorate([
    (0, typeorm_1.Entity)()
], ChannelBan);
exports.ChannelBan = ChannelBan;
//# sourceMappingURL=channel-ban.entity.js.map