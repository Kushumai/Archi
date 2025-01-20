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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
let JwtAuthGuard = class JwtAuthGuard {
    constructor(jwtService, reflector) {
        this.jwtService = jwtService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        console.log('>> URL demandée :', request.url);
        console.log('>> Headers :', request.headers);
        const isPublic = this.reflector.get('isPublic', context.getHandler());
        if (isPublic) {
            console.log('>> Route marquée @Public(), on bypass...');
            return true;
        }
        if (this.isInternalRequest(request)) {
            console.log('>> Requête considérée "interne", bypass en dev...');
            return true;
        }
        const token = this.extractTokenFromHeader(request);
        console.log('>> Token extrait :', token);
        if (!token) {
            throw new common_1.UnauthorizedException('Token not found');
        }
        try {
            const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
            request['user'] = payload;
            return true;
        }
        catch (error) {
            console.error('JWT Validation Error:', error.message);
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    isInternalRequest(request) {
        const origin = request.headers.origin || '';
        const internalOrigins = ['archi_auth_service_dev', 'archi_frontend_dev'];
        return process.env.NODE_ENV === 'development' &&
            internalOrigins.some((service) => origin.includes(service));
    }
    extractTokenFromHeader(request) {
        const authHeader = request.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            return authHeader.slice(7);
        }
        return undefined;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        core_1.Reflector])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map