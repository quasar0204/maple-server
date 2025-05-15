/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/event/src/auth/jwt-auth.guard.ts":
/*!***********************************************!*\
  !*** ./apps/event/src/auth/jwt-auth.guard.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        const result = super.canActivate(context);
        const req = context.switchToHttp().getRequest();
        req.user = this.getRequest(context).user;
        return result;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),

/***/ "./apps/event/src/auth/jwt.strategy.ts":
/*!*********************************************!*\
  !*** ./apps/event/src/auth/jwt.strategy.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }
    async validate(payload) {
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JwtStrategy);


/***/ }),

/***/ "./apps/event/src/auth/roles.decorator.ts":
/*!************************************************!*\
  !*** ./apps/event/src/auth/roles.decorator.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;


/***/ }),

/***/ "./apps/event/src/auth/roles.guard.ts":
/*!********************************************!*\
  !*** ./apps/event/src/auth/roles.guard.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.get('roles', context.getHandler());
        if (!requiredRoles)
            return true;
        const user = context.switchToHttp().getRequest().user;
        return requiredRoles.includes(user?.role);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),

/***/ "./apps/event/src/controllers/event.controller.ts":
/*!********************************************************!*\
  !*** ./apps/event/src/controllers/event.controller.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const event_service_1 = __webpack_require__(/*! ../services/event.service */ "./apps/event/src/services/event.service.ts");
const reward_service_1 = __webpack_require__(/*! ../services/reward.service */ "./apps/event/src/services/reward.service.ts");
const create_event_dto_1 = __webpack_require__(/*! ../dto/create-event.dto */ "./apps/event/src/dto/create-event.dto.ts");
const create_reward_dto_1 = __webpack_require__(/*! ../dto/create-reward.dto */ "./apps/event/src/dto/create-reward.dto.ts");
const claim_reward_dto_1 = __webpack_require__(/*! ../dto/claim-reward.dto */ "./apps/event/src/dto/claim-reward.dto.ts");
const condition_evaluator_1 = __webpack_require__(/*! ../utils/condition-evaluator */ "./apps/event/src/utils/condition-evaluator.ts");
const claim_service_1 = __webpack_require__(/*! ../services/claim.service */ "./apps/event/src/services/claim.service.ts");
const user_service_1 = __webpack_require__(/*! ../services/user.service */ "./apps/event/src/services/user.service.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/roles.decorator */ "./apps/event/src/auth/roles.decorator.ts");
let EventController = class EventController {
    constructor(eventService, rewardService, claimService, userService, conditionEvaluator) {
        this.eventService = eventService;
        this.rewardService = rewardService;
        this.claimService = claimService;
        this.userService = userService;
        this.conditionEvaluator = conditionEvaluator;
    }
    createEvent(dto) {
        return this.eventService.create(dto);
    }
    getAllEvents() {
        return this.eventService.findAll();
    }
    getEventById(id) {
        return this.eventService.findById(id);
    }
    createReward(dto) {
        return this.rewardService.create(dto);
    }
    getRewardsByEvent(eventId) {
        return this.rewardService.findByEvent(eventId);
    }
    async claimReward(dto) {
        const alreadyClaimed = await this.claimService.hasClaimed(dto.userId, dto.eventId);
        if (alreadyClaimed) {
            return this.claimService.createWithResult(dto, false, '이미 보상을 수령했습니다');
        }
        const user = await this.userService.getUserInfo(dto.userId);
        const event = await this.eventService.findById(dto.eventId);
        const success = this.conditionEvaluator.evaluate(event.conditions, user);
        const reason = success ? '조건 충족' : '조건 불충족';
        return this.claimService.createWithResult(dto, success, reason);
    }
    getClaimsByUser(userId) {
        return this.claimService.findByUser(userId);
    }
    getAllClaims() {
        return this.claimService.findAll();
    }
};
exports.EventController = EventController;
__decorate([
    (0, common_1.Post)('events'),
    (0, roles_decorator_1.Roles)('OPERATOR', 'ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof create_event_dto_1.CreateEventDto !== "undefined" && create_event_dto_1.CreateEventDto) === "function" ? _f : Object]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Get)('events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getAllEvents", null);
__decorate([
    (0, common_1.Get)('events/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getEventById", null);
__decorate([
    (0, common_1.Post)('rewards'),
    (0, roles_decorator_1.Roles)('OPERATOR', 'ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof create_reward_dto_1.CreateRewardDto !== "undefined" && create_reward_dto_1.CreateRewardDto) === "function" ? _g : Object]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "createReward", null);
__decorate([
    (0, common_1.Get)('rewards'),
    __param(0, (0, common_1.Query)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getRewardsByEvent", null);
__decorate([
    (0, common_1.Post)('claims'),
    (0, roles_decorator_1.Roles)('USER', 'ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof claim_reward_dto_1.ClaimRewardDto !== "undefined" && claim_reward_dto_1.ClaimRewardDto) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "claimReward", null);
__decorate([
    (0, common_1.Get)('claims/user/:userId'),
    (0, roles_decorator_1.Roles)('USER', 'ADMIN'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getClaimsByUser", null);
__decorate([
    (0, common_1.Get)('claims'),
    (0, roles_decorator_1.Roles)('AUDITOR', 'ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getAllClaims", null);
exports.EventController = EventController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof event_service_1.EventService !== "undefined" && event_service_1.EventService) === "function" ? _a : Object, typeof (_b = typeof reward_service_1.RewardService !== "undefined" && reward_service_1.RewardService) === "function" ? _b : Object, typeof (_c = typeof claim_service_1.ClaimService !== "undefined" && claim_service_1.ClaimService) === "function" ? _c : Object, typeof (_d = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _d : Object, typeof (_e = typeof condition_evaluator_1.ConditionEvaluator !== "undefined" && condition_evaluator_1.ConditionEvaluator) === "function" ? _e : Object])
], EventController);


/***/ }),

/***/ "./apps/event/src/dto/claim-reward.dto.ts":
/*!************************************************!*\
  !*** ./apps/event/src/dto/claim-reward.dto.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClaimRewardDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class ClaimRewardDto {
}
exports.ClaimRewardDto = ClaimRewardDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], ClaimRewardDto.prototype, "eventId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ClaimRewardDto.prototype, "userId", void 0);


/***/ }),

/***/ "./apps/event/src/dto/create-event.dto.ts":
/*!************************************************!*\
  !*** ./apps/event/src/dto/create-event.dto.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateEventDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
class ComparisonConditionDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComparisonConditionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComparisonConditionDto.prototype, "field", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['>=', '<=', '>', '<', '==', '!=']),
    __metadata("design:type", String)
], ComparisonConditionDto.prototype, "operator", void 0);
class AchievementConditionDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AchievementConditionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AchievementConditionDto.prototype, "achievementId", void 0);
class CreateEventDto {
}
exports.CreateEventDto = CreateEventDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['ON_DEMAND', 'ON_EVENT']),
    __metadata("design:type", String)
], CreateEventDto.prototype, "triggerType", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Object),
    __metadata("design:type", Array)
], CreateEventDto.prototype, "conditions", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateEventDto.prototype, "isActive", void 0);


/***/ }),

/***/ "./apps/event/src/dto/create-reward.dto.ts":
/*!*************************************************!*\
  !*** ./apps/event/src/dto/create-reward.dto.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateRewardDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
class RewardItemDto {
}
class CreateRewardDto {
}
exports.CreateRewardDto = CreateRewardDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateRewardDto.prototype, "eventId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RewardItemDto),
    __metadata("design:type", Array)
], CreateRewardDto.prototype, "rewards", void 0);


/***/ }),

/***/ "./apps/event/src/event.module.ts":
/*!****************************************!*\
  !*** ./apps/event/src/event.module.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const event_controller_1 = __webpack_require__(/*! ./controllers/event.controller */ "./apps/event/src/controllers/event.controller.ts");
const event_service_1 = __webpack_require__(/*! ./services/event.service */ "./apps/event/src/services/event.service.ts");
const reward_service_1 = __webpack_require__(/*! ./services/reward.service */ "./apps/event/src/services/reward.service.ts");
const claim_service_1 = __webpack_require__(/*! ./services/claim.service */ "./apps/event/src/services/claim.service.ts");
const event_schema_1 = __webpack_require__(/*! ./schemas/event.schema */ "./apps/event/src/schemas/event.schema.ts");
const reward_schema_1 = __webpack_require__(/*! ./schemas/reward.schema */ "./apps/event/src/schemas/reward.schema.ts");
const claim_schema_1 = __webpack_require__(/*! ./schemas/claim.schema */ "./apps/event/src/schemas/claim.schema.ts");
const condition_evaluator_1 = __webpack_require__(/*! ./utils/condition-evaluator */ "./apps/event/src/utils/condition-evaluator.ts");
const user_service_1 = __webpack_require__(/*! ./services/user.service */ "./apps/event/src/services/user.service.ts");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const jwt_strategy_1 = __webpack_require__(/*! ./auth/jwt.strategy */ "./apps/event/src/auth/jwt.strategy.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ./auth/jwt-auth.guard */ "./apps/event/src/auth/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ./auth/roles.guard */ "./apps/event/src/auth/roles.guard.ts");
let EventModule = class EventModule {
};
exports.EventModule = EventModule;
exports.EventModule = EventModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1h' },
            }),
            mongoose_1.MongooseModule.forRoot(process.env.EVENT_MONGO_URI),
            mongoose_1.MongooseModule.forFeature([
                { name: event_schema_1.Event.name, schema: event_schema_1.EventSchema },
                { name: reward_schema_1.Reward.name, schema: reward_schema_1.RewardSchema },
                { name: claim_schema_1.Claim.name, schema: claim_schema_1.ClaimSchema },
            ]),
        ],
        controllers: [event_controller_1.EventController],
        providers: [
            event_service_1.EventService,
            reward_service_1.RewardService,
            claim_service_1.ClaimService,
            condition_evaluator_1.ConditionEvaluator,
            user_service_1.UserService,
            jwt_strategy_1.JwtStrategy,
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
        ],
    })
], EventModule);


/***/ }),

/***/ "./apps/event/src/schemas/claim.schema.ts":
/*!************************************************!*\
  !*** ./apps/event/src/schemas/claim.schema.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClaimSchema = exports.Claim = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const event_schema_1 = __webpack_require__(/*! ./event.schema */ "./apps/event/src/schemas/event.schema.ts");
let Claim = class Claim {
};
exports.Claim = Claim;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Claim.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: event_schema_1.Event.name, required: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], Claim.prototype, "eventId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Claim.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Claim.prototype, "reason", void 0);
exports.Claim = Claim = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Claim);
exports.ClaimSchema = mongoose_1.SchemaFactory.createForClass(Claim);


/***/ }),

/***/ "./apps/event/src/schemas/event.schema.ts":
/*!************************************************!*\
  !*** ./apps/event/src/schemas/event.schema.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventSchema = exports.Event = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
let Event = class Event {
};
exports.Event = Event;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, required: true }),
    __metadata("design:type", Array)
], Event.prototype, "conditions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['ON_DEMAND', 'ON_EVENT'], default: 'ON_DEMAND' }),
    __metadata("design:type", String)
], Event.prototype, "triggerType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Event.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Event.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Event.prototype, "isActive", void 0);
exports.Event = Event = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Event);
exports.EventSchema = mongoose_1.SchemaFactory.createForClass(Event);


/***/ }),

/***/ "./apps/event/src/schemas/reward.schema.ts":
/*!*************************************************!*\
  !*** ./apps/event/src/schemas/reward.schema.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RewardSchema = exports.Reward = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const event_schema_1 = __webpack_require__(/*! ./event.schema */ "./apps/event/src/schemas/event.schema.ts");
let Reward = class Reward {
};
exports.Reward = Reward;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: event_schema_1.Event.name, required: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], Reward.prototype, "eventId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, required: true }),
    __metadata("design:type", Array)
], Reward.prototype, "rewards", void 0);
exports.Reward = Reward = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Reward);
exports.RewardSchema = mongoose_1.SchemaFactory.createForClass(Reward);


/***/ }),

/***/ "./apps/event/src/services/claim.service.ts":
/*!**************************************************!*\
  !*** ./apps/event/src/services/claim.service.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClaimService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const claim_schema_1 = __webpack_require__(/*! ../schemas/claim.schema */ "./apps/event/src/schemas/claim.schema.ts");
const event_service_1 = __webpack_require__(/*! ./event.service */ "./apps/event/src/services/event.service.ts");
const reward_service_1 = __webpack_require__(/*! ./reward.service */ "./apps/event/src/services/reward.service.ts");
const condition_evaluator_1 = __webpack_require__(/*! ../utils/condition-evaluator */ "./apps/event/src/utils/condition-evaluator.ts");
const user_service_1 = __webpack_require__(/*! ./user.service */ "./apps/event/src/services/user.service.ts");
let ClaimService = class ClaimService {
    constructor(claimModel, eventService, rewardService, conditionEvaluator, userService) {
        this.claimModel = claimModel;
        this.eventService = eventService;
        this.rewardService = rewardService;
        this.conditionEvaluator = conditionEvaluator;
        this.userService = userService;
    }
    async hasClaimed(userId, eventId) {
        const existing = await this.claimModel.findOne({ userId, eventId });
        return !!existing;
    }
    async createWithResult(dto, status, reason) {
        const rewards = await this.rewardService.findByEvent(dto.eventId);
        const claim = new this.claimModel({
            userId: dto.userId,
            eventId: dto.eventId,
            status: status ? 'SUCCESS' : 'FAILED',
            reason,
            rewardsGiven: status ? rewards.flatMap(r => r.rewards) : [],
        });
        return claim.save();
    }
    async findAll() {
        return this.claimModel.find();
    }
    async findByUser(userId) {
        return this.claimModel.find({ userId });
    }
};
exports.ClaimService = ClaimService;
exports.ClaimService = ClaimService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(claim_schema_1.Claim.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof event_service_1.EventService !== "undefined" && event_service_1.EventService) === "function" ? _b : Object, typeof (_c = typeof reward_service_1.RewardService !== "undefined" && reward_service_1.RewardService) === "function" ? _c : Object, typeof (_d = typeof condition_evaluator_1.ConditionEvaluator !== "undefined" && condition_evaluator_1.ConditionEvaluator) === "function" ? _d : Object, typeof (_e = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _e : Object])
], ClaimService);


/***/ }),

/***/ "./apps/event/src/services/event.service.ts":
/*!**************************************************!*\
  !*** ./apps/event/src/services/event.service.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const event_schema_1 = __webpack_require__(/*! ../schemas/event.schema */ "./apps/event/src/schemas/event.schema.ts");
let EventService = class EventService {
    constructor(eventModel) {
        this.eventModel = eventModel;
    }
    async create(dto) {
        const created = new this.eventModel(dto);
        return created.save();
    }
    async findAll() {
        return this.eventModel.find().sort({ createdAt: -1 }).exec();
    }
    async findById(id) {
        return this.eventModel.findById(id).exec();
    }
};
exports.EventService = EventService;
exports.EventService = EventService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(event_schema_1.Event.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], EventService);


/***/ }),

/***/ "./apps/event/src/services/reward.service.ts":
/*!***************************************************!*\
  !*** ./apps/event/src/services/reward.service.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RewardService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const reward_schema_1 = __webpack_require__(/*! ../schemas/reward.schema */ "./apps/event/src/schemas/reward.schema.ts");
let RewardService = class RewardService {
    constructor(rewardModel) {
        this.rewardModel = rewardModel;
    }
    async create(dto) {
        const created = new this.rewardModel(dto);
        return created.save();
    }
    async findByEvent(eventId) {
        return this.rewardModel.find({ eventId }).exec();
    }
};
exports.RewardService = RewardService;
exports.RewardService = RewardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(reward_schema_1.Reward.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], RewardService);


/***/ }),

/***/ "./apps/event/src/services/user.service.ts":
/*!*************************************************!*\
  !*** ./apps/event/src/services/user.service.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let UserService = class UserService {
    async getUserInfo(userId) {
        return {
            userId,
            level: 290,
            achievements: [
                'EXTREME_KALLOS_CLEAR',
                'DAILY_LOGIN_365',
                'PUNCHKING_TOP10_LARA'
            ],
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);


/***/ }),

/***/ "./apps/event/src/utils/condition-evaluator.ts":
/*!*****************************************************!*\
  !*** ./apps/event/src/utils/condition-evaluator.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConditionEvaluator = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let ConditionEvaluator = class ConditionEvaluator {
    evaluate(conditions, user) {
        for (const cond of conditions) {
            if (cond.type === 'comparison') {
                const actual = user[cond.field];
                const expected = cond.value;
                switch (cond.operator) {
                    case '>=':
                        if (!(actual >= expected))
                            return false;
                        break;
                    case '<=':
                        if (!(actual <= expected))
                            return false;
                        break;
                    case '>':
                        if (!(actual > expected))
                            return false;
                        break;
                    case '<':
                        if (!(actual < expected))
                            return false;
                        break;
                    case '==':
                        if (!(actual == expected))
                            return false;
                        break;
                    case '!=':
                        if (!(actual != expected))
                            return false;
                        break;
                }
            }
            if (cond.type === 'achievement') {
                if (!user.achievements?.includes(cond.achievementId)) {
                    return false;
                }
            }
        }
        return true;
    }
};
exports.ConditionEvaluator = ConditionEvaluator;
exports.ConditionEvaluator = ConditionEvaluator = __decorate([
    (0, common_1.Injectable)()
], ConditionEvaluator);


/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/mongoose":
/*!***********************************!*\
  !*** external "@nestjs/mongoose" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "class-transformer":
/*!************************************!*\
  !*** external "class-transformer" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!********************************!*\
  !*** ./apps/event/src/main.ts ***!
  \********************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const event_module_1 = __webpack_require__(/*! ./event.module */ "./apps/event/src/event.module.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_auth_guard_1 = __webpack_require__(/*! ./auth/jwt-auth.guard */ "./apps/event/src/auth/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ./auth/roles.guard */ "./apps/event/src/auth/roles.guard.ts");
const core_2 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
async function bootstrap() {
    const app = await core_1.NestFactory.create(event_module_1.EventModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    const reflector = app.get(core_2.Reflector);
    app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(), new roles_guard_1.RolesGuard(reflector));
    await app.listen(3002);
}
bootstrap();

})();

/******/ })()
;