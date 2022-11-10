"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const auth_module_1 = require("./auth/auth.module");
const http_exception_filter_1 = require("./filters/http-exception.filter");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new auth_module_1.AuthModule);
    app.setGlobalPrefix('api', {
        exclude: [{ path: 'log', method: common_1.RequestMethod.GET },
            { path: 'logout', method: common_1.RequestMethod.GET },
            { path: 'callback', method: common_1.RequestMethod.GET }],
    });
    app.useGlobalFilters(new http_exception_filter_1.NotFoundExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    app.enableCors({ origin: 'http://localhost:3000', credentials: true });
    app.use(cookieParser());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map