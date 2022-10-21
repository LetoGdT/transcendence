"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const auth_module_1 = require("./auth/auth.module");
const http_exception_filter_1 = require("./filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new auth_module_1.AuthModule);
    app.useGlobalFilters(new http_exception_filter_1.NotFoundExceptionFilter());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map