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
exports.ChannelsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const channel_entity_1 = require("../typeorm/channel.entity");
const channel_user_entity_1 = require("../typeorm/channel-user.entity");
let ChannelsService = class ChannelsService {
    constructor(channelRepository) {
        this.channelRepository = channelRepository;
    }
    async getChannels() {
        const queryBuilder = this.channelRepository.createQueryBuilder('channel');
        queryBuilder
            .leftJoinAndSelect('channel.users', 'users')
            .leftJoinAndSelect('users.user', 'user');
        return queryBuilder.getMany();
    }
    async createChannel(postChannelDto, requester) {
        const owner = new channel_user_entity_1.ChannelUser();
        owner.user = requester;
        owner.role = 'Owner';
        const newChannel = await this.channelRepository.create({
            name: postChannelDto.name,
            users: [owner],
            status: 'private',
        });
        return this.channelRepository.save(newChannel);
    }
    async joinChannel(id, requester) {
        const newUser = new channel_user_entity_1.ChannelUser();
        newUser.user = requester;
        newUser.role = 'None';
        const queryBuilder = this.channelRepository.createQueryBuilder('channel');
        queryBuilder
            .leftJoinAndSelect('channel.users', 'users')
            .leftJoinAndSelect('users.user', 'user');
        const channel = await queryBuilder.getOne();
        channel.users.push(newUser);
        console.log(channel);
        console.log(channel.users);
        return this.channelRepository.save(channel);
    }
};
ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChannelsService);
exports.ChannelsService = ChannelsService;
//# sourceMappingURL=channels.service.js.map