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
exports.PrivatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const messages_service_1 = require("../messages/messages.service");
const private_message_entity_1 = require("../typeorm/private-message.entity");
const page_dto_1 = require("../dto/page.dto");
const page_meta_dto_1 = require("../dto/page-meta.dto");
let PrivatesService = class PrivatesService {
    constructor(privatesRepository, usersService, messagesService) {
        this.privatesRepository = privatesRepository;
        this.usersService = usersService;
        this.messagesService = messagesService;
        this.IdMax = Number.MAX_SAFE_INTEGER;
    }
    async getMessages(pageOptionsDto, messageQueryFilterDto, userSelectDto, user, options) {
        const queryBuilder = this.privatesRepository.createQueryBuilder("private");
        queryBuilder
            .leftJoinAndSelect('private.message', 'message')
            .leftJoinAndSelect('message.recipient', 'recipient')
            .leftJoinAndSelect('message.sender', 'sender')
            .where(messageQueryFilterDto.id != null
            ? 'private.id = :id'
            : 'TRUE', { id: messageQueryFilterDto.id })
            .andWhere(messageQueryFilterDto.message_id != null
            ? 'message.id = :message_id'
            : 'TRUE', { message_id: messageQueryFilterDto.message_id })
            .andWhere(messageQueryFilterDto.start_at != null
            ? 'message.sent_date > :start_at'
            : 'TRUE', { start_at: messageQueryFilterDto.start_at })
            .andWhere(messageQueryFilterDto.end_at != null
            ? 'message.sent_date < :end_at'
            : 'TRUE', { end_at: messageQueryFilterDto.end_at })
            .andWhere(userSelectDto.sender_id != null
            ? 'message.sender = :sender_id'
            : 'TRUE', { sender_id: userSelectDto.sender_id })
            .andWhere(userSelectDto.recipient_id != null
            ? 'message.recipient = :recipient_id'
            : 'TRUE', { recipient_id: userSelectDto.recipient_id })
            .andWhere(new typeorm_2.Brackets(qb => {
            qb.where("message.sender = :user_id", { user_id: user.id })
                .orWhere("message.recipient = :user_id", { user_id: user.id });
        }))
            .andWhere(options && options.as_sender == true
            ? 'message.recipient = :user_id'
            : 'TRUE', { user_id: user.id })
            .andWhere(options && options.as_recipient == true
            ? 'message.sender = :user_id'
            : 'TRUE', { user_id: user.id })
            .orderBy('message.sent_date', pageOptionsDto.order)
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);
        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();
        const pageMetaDto = new page_meta_dto_1.PageMetaDto({ itemCount, pageOptionsDto });
        return new page_dto_1.PageDto(entities, pageMetaDto);
    }
    async createMessage(postPrivateDto, sender) {
        let recipient;
        if (postPrivateDto.recipient_id != null)
            recipient = await this.usersService.getOneById(postPrivateDto.recipient_id);
        else if (postPrivateDto.recipient_name != null)
            recipient = await this.usersService.getOneByLogin(postPrivateDto.recipient_name);
        else
            throw new common_1.HttpException('Neither login or id were provided', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        if (recipient == null)
            throw new common_1.BadRequestException('User not found');
        const message = await this.messagesService.createMessage(sender, recipient, postPrivateDto.content);
        const privateMessage = new private_message_entity_1.PrivateMessage();
        privateMessage.message = message;
        return this.privatesRepository.save(privateMessage);
    }
    async getConversations(user) {
        const queryBuilder = this.privatesRepository.createQueryBuilder("private");
        queryBuilder
            .leftJoinAndSelect('private.message', 'message')
            .leftJoinAndSelect('message.recipient', 'recipient')
            .leftJoinAndSelect('message.sender', 'sender')
            .where(new typeorm_2.Brackets(qb => {
            qb.where("message.sender = :user_id", { user_id: user.id })
                .orWhere("message.recipient = :user_id", { user_id: user.id });
        }))
            .distinctOn(['sender', 'recipient']);
        return await queryBuilder.getMany();
    }
    async updateMessage(id, updateMessageDto, user) {
        if (id > this.IdMax)
            throw new common_1.BadRequestException(`id must not be greater than ${this.IdMax}`);
        const queryBuilder = this.privatesRepository.createQueryBuilder("private");
        queryBuilder
            .leftJoinAndSelect('private.message', 'message')
            .leftJoinAndSelect('message.recipient', 'recipient')
            .leftJoinAndSelect('message.sender', 'sender')
            .where("private.id = :id", { id: id })
            .andWhere("message.sender = :user_id", { user_id: user.id });
        const items = await queryBuilder.getManyAndCount();
        if (items[1] !== 1)
            throw new common_1.BadRequestException('Couldn\'t update message');
        const priv = items[0][0];
        priv.message.content = updateMessageDto.content;
        await this.messagesService.updateMessage(priv.message);
        return priv;
    }
    async deleteMessage(id, user) {
        if (id > this.IdMax)
            throw new common_1.BadRequestException(`id must not be greater than ${this.IdMax}`);
        const queryBuilder = this.privatesRepository.createQueryBuilder("private");
        queryBuilder
            .leftJoinAndSelect('private.message', 'message')
            .leftJoinAndSelect('message.recipient', 'recipient')
            .leftJoinAndSelect('message.sender', 'sender')
            .where("private.id = :id", { id: id })
            .andWhere("message.sender = :user_id", { user_id: user.id });
        const items = await queryBuilder.getManyAndCount();
        if (items[1] !== 1)
            throw new common_1.BadRequestException('Couldn\'t delete message');
        const ret = await this.privatesRepository.remove(items[0][0]);
        await this.messagesService.deleteMessage(items[0][0].message);
        return items[0][0];
    }
};
PrivatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(private_message_entity_1.PrivateMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        messages_service_1.MessagesService])
], PrivatesService);
exports.PrivatesService = PrivatesService;
//# sourceMappingURL=privates.service.js.map