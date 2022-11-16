"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivatesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const privates_controller_1 = require("./privates.controller");
const privates_service_1 = require("./privates.service");
const messages_module_1 = require("../messages/messages.module");
const private_message_entity_1 = require("../typeorm/private-message.entity");
let PrivatesModule = class PrivatesModule {
};
PrivatesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([private_message_entity_1.PrivateMessage]), messages_module_1.MessagesModule],
        controllers: [privates_controller_1.PrivatesController],
        providers: [privates_service_1.PrivatesService]
    })
], PrivatesModule);
exports.PrivatesModule = PrivatesModule;
//# sourceMappingURL=privates.module.js.map