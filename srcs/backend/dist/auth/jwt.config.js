"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
exports.jwtConfig = {
    useFactory: () => {
        return {
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        };
    },
};
//# sourceMappingURL=jwt.config.js.map