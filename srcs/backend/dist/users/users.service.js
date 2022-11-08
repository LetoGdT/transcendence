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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../typeorm/user.entity");
const page_dto_1 = require("../dto/page.dto");
const page_meta_dto_1 = require("../dto/page-meta.dto");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.IdMax = 1000000000000;
    }
    async getUsers(pageOptionsDto, userQueryFilterDto) {
        const queryBuilder = this.userRepository.createQueryBuilder("user");
        queryBuilder
            .where(pageOptionsDto['id'] != null
            ? 'user.id = :id'
            : 'TRUE', { id: userQueryFilterDto.id })
            .andWhere(pageOptionsDto['uid'] != null
            ? 'user.uid = :uid'
            : 'TRUE', { uid: userQueryFilterDto.uid })
            .andWhere(pageOptionsDto['username'] != null
            ? 'user.username LIKE :username'
            : 'TRUE', { username: userQueryFilterDto.username })
            .andWhere(pageOptionsDto['email'] != null
            ? 'user.email LIKE :email'
            : 'TRUE', { email: userQueryFilterDto.email })
            .andWhere(pageOptionsDto['image_url'] != null
            ? 'user.image_url LIKE :image_url'
            : 'TRUE', { image_url: userQueryFilterDto.image_url })
            .orderBy("user.id", pageOptionsDto.order)
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);
        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();
        const pageMetaDto = new page_meta_dto_1.PageMetaDto({ itemCount, pageOptionsDto });
        return new page_dto_1.PageDto(entities, pageMetaDto);
    }
    async getOneById(id) {
        if (id > this.IdMax)
            throw new common_1.BadRequestException(`id must not be greater than ${this.IdMax}`);
        return this.userRepository.findOne({ where: { id: id } });
    }
    async getOneByRefresh(refresh) {
        return this.userRepository.findOne({ where: { refresh_token: refresh } });
    }
    async updateOne(id, updateUserDto) {
        if (id > this.IdMax)
            throw new common_1.BadRequestException(`id must not be greater than ${this.IdMax}`);
        return await this.userRepository.update(id, updateUserDto);
    }
    async addUser(createUserDto) {
        const user = await this.userRepository.findOne({ where: { uid: createUserDto.uid } });
        if (user)
            return user;
        const newUser = this.userRepository.create(createUserDto);
        return this.userRepository.save(newUser);
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map