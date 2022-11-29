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
const bcrypt = require("bcrypt");
const channel_entity_1 = require("../typeorm/channel.entity");
const channel_user_entity_1 = require("../typeorm/channel-user.entity");
const message_entity_1 = require("../typeorm/message.entity");
const messages_service_1 = require("../messages/messages.service");
const page_dto_1 = require("../dto/page.dto");
const page_meta_dto_1 = require("../dto/page-meta.dto");
let ChannelsService = class ChannelsService {
    constructor(channelRepository, channelUserRepository, messagesService) {
        this.channelRepository = channelRepository;
        this.channelUserRepository = channelUserRepository;
        this.messagesService = messagesService;
        this.IdMax = Number.MAX_SAFE_INTEGER;
        this.permissions = new Map([
            ["Owner", 2],
            ["Admin", 1],
            ["None", 0],
        ]);
    }
    async getChannels(pageOptionsDto, user) {
        const queryBuilder = this.channelRepository.createQueryBuilder('channel');
        queryBuilder
            .leftJoinAndSelect('channel.users', 'users')
            .leftJoinAndSelect('users.user', 'user')
            .orderBy('channel.id', pageOptionsDto.order)
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);
        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();
        const pageMetaDto = new page_meta_dto_1.PageMetaDto({ itemCount, pageOptionsDto });
        return new page_dto_1.PageDto(entities, pageMetaDto);
    }
    async getChannelUsers(pageOptionsDto, id, user) {
        const queryBuilder = this.channelUserRepository.createQueryBuilder('channelUser');
        queryBuilder
            .leftJoinAndSelect('channelUser.user', 'user')
            .where('channelUser.channel = :id', { id: id })
            .orderBy('channelUser.id', pageOptionsDto.order)
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);
        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();
        const pageMetaDto = new page_meta_dto_1.PageMetaDto({ itemCount, pageOptionsDto });
        return new page_dto_1.PageDto(entities, pageMetaDto);
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
    async updateChannel(id, patchChannelDto, user) {
        const queryBuilder = this.channelRepository.createQueryBuilder('channel');
        queryBuilder
            .leftJoinAndSelect('channel.users', 'users')
            .leftJoinAndSelect('users.user', 'user')
            .where('channel.id = :id', { id: id });
        const channel = await queryBuilder.getOne();
        if (channel == null)
            throw new common_1.BadRequestException('Channel not found');
        let channelUser = null;
        for (let tmp_channelUser of channel.users) {
            if (JSON.stringify(tmp_channelUser.user) === JSON.stringify(user)) {
                channelUser = tmp_channelUser;
                break;
            }
        }
        if (channelUser.role === 'None')
            throw new common_1.HttpException('You are not a channel administrator', common_1.HttpStatus.FORBIDDEN);
        channel.status = patchChannelDto.status;
        if (channel.status == 'protected') {
            if (patchChannelDto.password == null)
                throw new common_1.BadRequestException('A password is expected for protected channels');
            channel.password = await bcrypt.hash(patchChannelDto.password, 10);
        }
        else
            channel.password = null;
        return this.channelRepository.save(channel);
    }
    async joinChannel(id, requester, password) {
        if (id > this.IdMax)
            throw new common_1.BadRequestException(`id must not be greater than ${this.IdMax}`);
        const queryBuilder = this.channelRepository.createQueryBuilder('channel');
        queryBuilder
            .leftJoinAndSelect('channel.users', 'users')
            .leftJoinAndSelect('users.user', 'user')
            .where('channel.id = :id', { id: id });
        const channel = await queryBuilder.getOne();
        if (channel == null)
            throw new common_1.BadRequestException('Channel not found');
        if (channel.status == 'private')
            throw new common_1.BadRequestException('This channel is private');
        if (channel.status == 'protected') {
            if (password == null)
                throw new common_1.BadRequestException('A password is expected for protected channels');
            const isMatch = await bcrypt.compare(password, channel.password);
            if (!isMatch)
                throw new common_1.HttpException('Passwords don\'t match', common_1.HttpStatus.FORBIDDEN);
        }
        for (let channelUser of channel.users) {
            if (JSON.stringify(channelUser.user) == JSON.stringify(requester))
                return channel;
        }
        const newUser = new channel_user_entity_1.ChannelUser();
        newUser.user = requester;
        newUser.role = 'None';
        channel.users.push(newUser);
        return this.channelRepository.save(channel);
    }
    async updateChannelUser(channel_id, user_id, user, role) {
        if (channel_id > this.IdMax || user_id > this.IdMax)
            throw new common_1.BadRequestException(`id must not be greater than ${this.IdMax}`);
        const queryBuilder = this.channelRepository.createQueryBuilder('channel');
        queryBuilder
            .leftJoinAndSelect('channel.users', 'users')
            .leftJoinAndSelect('users.user', 'user')
            .where('channel.id = :channel_id', { channel_id: channel_id });
        const channel = await queryBuilder.getOne();
        let requester = null;
        let toChange = null;
        for (let channelUser of channel.users) {
            if (JSON.stringify(channelUser.user) == JSON.stringify(user))
                requester = channelUser;
            if (channelUser.id == user_id)
                toChange = channelUser;
        }
        if (requester == null)
            throw new common_1.HttpException('You are not in this channel', common_1.HttpStatus.FORBIDDEN);
        if (toChange == null)
            throw new common_1.BadRequestException('User not found');
        if (channel == null)
            throw new common_1.BadRequestException('Channel not found');
        if (requester.id == toChange.id)
            throw new common_1.BadRequestException('You can\'t modify your own role !');
        const toChangeIndex = channel.users.findIndex((user) => {
            return user.id === toChange.id;
        });
        const requesterIndex = channel.users.findIndex((user) => {
            return user.id === requester.id;
        });
        if (this.permissions.get(requester.role) > this.permissions.get(toChange.role)
            && this.permissions.get(role) <= this.permissions.get(requester.role)) {
            channel.users[toChangeIndex].role = role;
            if (role == 'Owner')
                channel.users[requesterIndex].role = 'Admin';
            return this.channelRepository.save(channel);
        }
        throw new common_1.HttpException('You don\'t have permissions to execute this action', common_1.HttpStatus.FORBIDDEN);
    }
    findToPromote(users) {
        let toPromoteIndex = users.findIndex((user) => {
            return user.role === 'Admin';
        });
        if (toPromoteIndex !== -1)
            return toPromoteIndex;
        return users.findIndex((user) => {
            return user.role === 'None';
        });
    }
    async deleteChannelUser(channel_id, user_id, user) {
        if (channel_id > this.IdMax || user_id > this.IdMax)
            throw new common_1.BadRequestException(`id must not be greater than ${this.IdMax}`);
        const queryBuilder = this.channelRepository.createQueryBuilder('channel');
        queryBuilder
            .leftJoinAndSelect('channel.users', 'users')
            .leftJoinAndSelect('users.user', 'user')
            .where('channel.id = :channel_id', { channel_id: channel_id });
        const channel = await queryBuilder.getOne();
        let requester = null;
        let toDelete = null;
        for (let channelUser of channel.users) {
            if (JSON.stringify(channelUser.user) == JSON.stringify(user))
                requester = channelUser;
            if (channelUser.id == user_id)
                toDelete = channelUser;
        }
        if (requester == null)
            throw new common_1.HttpException('You are not in this channel', common_1.HttpStatus.FORBIDDEN);
        if (toDelete == null)
            throw new common_1.BadRequestException('User not found');
        if (channel == null)
            throw new common_1.BadRequestException('Channel not found');
        const toDeleteIndex = channel.users.findIndex((user) => {
            return user.id === toDelete.id;
        });
        if (requester.id == toDelete.id
            || this.permissions.get(requester.role) > this.permissions.get(toDelete.role)) {
            if (channel.users.length === 1) {
                await queryBuilder.delete().where("id = :id", { id: channel_id }).execute();
                channel.users = [];
                return channel;
            }
            channel.users.splice(toDeleteIndex, 1);
            if (toDelete.role == 'Owner')
                channel.users[this.findToPromote(channel.users)].role = 'Owner';
            await this.channelUserRepository.remove(toDelete);
            return this.channelRepository.save(channel);
        }
        throw new common_1.HttpException('You can\'t delete a user with a higher or equal role', common_1.HttpStatus.FORBIDDEN);
    }
    async getChannelMessages(channel_id, pageOptionsDto, messageQueryFilterDto, userSelectDto, user, as_sender) {
        return await this.messagesService.getChannelMessages(channel_id, pageOptionsDto, messageQueryFilterDto, userSelectDto, user, as_sender);
    }
    async createChannelMessage(channel_id, postPrivateDto, sender) {
        if (channel_id > this.IdMax)
            throw new common_1.BadRequestException(`channel_id must not be greater than ${this.IdMax}`);
        const queryBuilder = this.channelRepository.createQueryBuilder('channel');
        queryBuilder
            .leftJoinAndSelect('channel.users', 'users')
            .leftJoinAndSelect('channel.messages', 'messages')
            .leftJoinAndSelect('users.user', 'user')
            .where('channel.id = :channel_id', { channel_id: channel_id });
        const channel = await queryBuilder.getOne();
        if (channel == null)
            throw new common_1.HttpException('Not found', common_1.HttpStatus.NOT_FOUND);
        let senderIndex = channel.users.findIndex((user) => {
            return user.user.id === sender.id;
        });
        if (senderIndex === -1)
            throw new common_1.HttpException('You are not in this channel', common_1.HttpStatus.FORBIDDEN);
        const newMessage = new message_entity_1.Message();
        newMessage.sender = sender;
        newMessage.content = postPrivateDto.content;
        channel.messages.push(newMessage);
        return this.channelRepository.save(channel);
    }
    async updateChannelMessage(channel_id, message_id, updateMessageDto, sender) {
        if (channel_id > this.IdMax)
            throw new common_1.BadRequestException(`channel_id must not be greater than ${this.IdMax}`);
        const queryBuilder = this.channelRepository.createQueryBuilder('channel');
        queryBuilder
            .leftJoinAndSelect('channel.users', 'users')
            .leftJoinAndSelect('channel.messages', 'messages')
            .leftJoinAndSelect('users.user', 'user')
            .where('channel.id = :channel_id', { channel_id: channel_id });
        const channel = await queryBuilder.getOne();
        if (channel == null)
            throw new common_1.HttpException('Channel not found', common_1.HttpStatus.NOT_FOUND);
        let senderIndex = channel.users.findIndex((user) => {
            return user.user.id === sender.id;
        });
        if (senderIndex === -1)
            throw new common_1.HttpException('You are not in this channel', common_1.HttpStatus.FORBIDDEN);
        let messageIndex = channel.messages.findIndex((message) => {
            return message.id == message_id;
        });
        if (messageIndex === -1)
            throw new common_1.HttpException('Message not found', common_1.HttpStatus.NOT_FOUND);
        if (channel.messages[messageIndex].sender.id != sender.id)
            throw new common_1.HttpException('You can only modify your own messages', common_1.HttpStatus.FORBIDDEN);
        return this.messagesService.updateMessageFromId(message_id, updateMessageDto.content);
    }
    async deleteChannelMessage(channel_id, message_id, sender) {
        if (channel_id > this.IdMax)
            throw new common_1.BadRequestException(`channel_id must not be greater than ${this.IdMax}`);
        const queryBuilder = this.channelRepository.createQueryBuilder('channel');
        queryBuilder
            .leftJoinAndSelect('channel.users', 'users')
            .leftJoinAndSelect('channel.messages', 'messages')
            .leftJoinAndSelect('messages.sender', 'sender')
            .leftJoinAndSelect('users.user', 'user')
            .where('channel.id = :channel_id', { channel_id: channel_id });
        const channel = await queryBuilder.getOne();
        if (channel == null)
            throw new common_1.HttpException('Channel not found', common_1.HttpStatus.NOT_FOUND);
        let senderIndex = channel.users.findIndex((user) => {
            return user.user.id === sender.id;
        });
        if (senderIndex === -1)
            throw new common_1.HttpException('You are not in this channel', common_1.HttpStatus.FORBIDDEN);
        let messageIndex = channel.messages.findIndex((message) => {
            return message.id == message_id;
        });
        if (messageIndex === -1)
            throw new common_1.HttpException('Message not found', common_1.HttpStatus.NOT_FOUND);
        console.log(channel.messages[messageIndex]);
        if (channel.messages[messageIndex].sender.id != sender.id)
            throw new common_1.HttpException('You can only delete your own messages', common_1.HttpStatus.FORBIDDEN);
        await this.messagesService.deleteMessage(channel.messages[messageIndex]);
        channel.messages.splice(messageIndex, 1);
        return this.channelRepository.save(channel);
    }
};
ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __param(1, (0, typeorm_1.InjectRepository)(channel_user_entity_1.ChannelUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        messages_service_1.MessagesService])
], ChannelsService);
exports.ChannelsService = ChannelsService;
//# sourceMappingURL=channels.service.js.map