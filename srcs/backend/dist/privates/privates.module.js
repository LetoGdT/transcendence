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
const privates_controller_1 = require("./privates.controller");
const privates_service_1 = require("./privates.service");
let PrivatesModule = class PrivatesModule {
};
PrivatesModule = __decorate([
    (0, common_1.Module)({
        controllers: [privates_controller_1.PrivatesController],
        providers: [privates_service_1.PrivatesService]
    })
], PrivatesModule);
exports.PrivatesModule = PrivatesModule;
//# sourceMappingURL=privates.module.js.map