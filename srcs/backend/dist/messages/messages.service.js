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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("../typeorm/message.entity");
const page_dto_1 = require("../dto/page.dto");
const page_meta_dto_1 = require("../dto/page-meta.dto");
let MessagesService = class MessagesService {
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    async getMessages(pageOptionsDto, messageQueryFilterDto, userSelectDto, user, options) {
        const queryBuilder = this.messageRepository.createQueryBuilder("message");
        queryBuilder
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('message.recipient', 'recipient')
            .where(messageQueryFilterDto.id != null
            ? 'message.id = :id'
            : 'TRUE', { id: messageQueryFilterDto.id })
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
    async createMessage(sender, recipient, content) {
        const newMessage = this.messageRepository.create({
            sender: sender,
            recipient: recipient,
            content: content
        });
        return this.messageRepository.save(newMessage);
    }
    async updateMessage(message) {
        return this.messageRepository.save(message);
    }
    async deleteMessage(message) {
        this.messageRepository.remove(message);
    }
};
MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MessagesService);
exports.MessagesService = MessagesService;
//# sourceMappingURL=messages.service.js.map