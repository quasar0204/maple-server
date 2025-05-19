/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventModule = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const core_1 = __webpack_require__(1);
const event_controller_1 = __webpack_require__(6);
const event_service_1 = __webpack_require__(7);
const reward_service_1 = __webpack_require__(10);
const claim_service_1 = __webpack_require__(12);
const event_schema_1 = __webpack_require__(9);
const reward_schema_1 = __webpack_require__(11);
const claim_schema_1 = __webpack_require__(13);
const condition_evaluator_1 = __webpack_require__(14);
const user_service_1 = __webpack_require__(15);
const jwt_1 = __webpack_require__(31);
const passport_1 = __webpack_require__(32);
const jwt_strategy_1 = __webpack_require__(33);
const jwt_auth_guard_1 = __webpack_require__(35);
const roles_guard_1 = __webpack_require__(36);
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
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 6 */
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventController = void 0;
const common_1 = __webpack_require__(3);
const event_service_1 = __webpack_require__(7);
const reward_service_1 = __webpack_require__(10);
const claim_service_1 = __webpack_require__(12);
const user_service_1 = __webpack_require__(15);
const condition_evaluator_1 = __webpack_require__(14);
const create_event_dto_1 = __webpack_require__(16);
const update_event_dto_1 = __webpack_require__(20);
const create_reward_dto_1 = __webpack_require__(22);
const update_reward_dto_1 = __webpack_require__(24);
const claim_reward_dto_1 = __webpack_require__(25);
const update_claim_status_dto_1 = __webpack_require__(26);
const response_event_dto_1 = __webpack_require__(27);
const response_reward_dto_1 = __webpack_require__(28);
const response_claim_dto_1 = __webpack_require__(29);
const roles_decorator_1 = __webpack_require__(30);
const common_2 = __webpack_require__(3);
const swagger_1 = __webpack_require__(19);
let EventController = class EventController {
    constructor(eventService, rewardService, claimService, userService, conditionEvaluator) {
        this.eventService = eventService;
        this.rewardService = rewardService;
        this.claimService = claimService;
        this.userService = userService;
        this.conditionEvaluator = conditionEvaluator;
    }
    mapToEventResponse(event, rewards) {
        return {
            _id: event._id.toString(),
            title: event.title,
            description: event.description,
            triggerType: event.triggerType,
            conditions: event.conditions,
            startDate: event.startDate.toISOString(),
            endDate: event.endDate.toISOString(),
            isActive: event.isActive,
            rewards,
        };
    }
    mapToRewardResponse(reward) {
        return {
            _id: reward._id.toString(),
            eventId: reward.eventId.toString(),
            rewards: reward.rewards,
        };
    }
    mapToClaimResponse(claim) {
        return {
            _id: claim._id.toString(),
            userId: claim.userId,
            eventId: claim.eventId.toString(),
            status: claim.status,
            reason: claim.reason,
            rewardsGiven: claim.rewardsGiven,
            createdAt: claim.createdAt.toISOString(),
            updatedAt: claim.updatedAt.toISOString(),
        };
    }
    async createEvent(dto) {
        const created = await this.eventService.create(dto);
        return this.mapToEventResponse(created, []);
    }
    async getAllEvents() {
        const events = await this.eventService.findAll();
        return Promise.all(events.map(async (event) => {
            const rewards = await this.rewardService.findByEvent(event._id.toString());
            return this.mapToEventResponse(event, rewards.flatMap((r) => r.rewards.map((item) => ({ ...item }))));
        }));
    }
    async getEventById(id) {
        const event = await this.eventService.findById(id);
        const rewards = await this.rewardService.findByEvent(id);
        return this.mapToEventResponse(event, rewards.flatMap((r) => r.rewards.map((item) => ({ ...item }))));
    }
    async updateEvent(id, dto) {
        const updated = await this.eventService.update(id, dto);
        return this.mapToEventResponse(updated, []);
    }
    async toggleEventActive(id) {
        const toggled = await this.eventService.toggleActive(id);
        return this.mapToEventResponse(toggled, []);
    }
    async createReward(eventId, dto) {
        const created = await this.rewardService.create({ ...dto, eventId });
        return this.mapToRewardResponse(created);
    }
    async updateReward(eventId, rewardId, dto) {
        const updated = await this.rewardService.update(eventId, rewardId, dto);
        return this.mapToRewardResponse(updated);
    }
    deleteReward(eventId, rewardId) {
        return this.rewardService.delete(eventId, rewardId);
    }
    async claimReward(eventId, dto) {
        const alreadyClaimed = await this.claimService.hasClaimed(dto.userId, eventId);
        if (alreadyClaimed) {
            const previous = await this.claimService.findOne(dto.userId, eventId);
            switch (previous?.status) {
                case 'SUCCESS':
                    throw new common_2.BadRequestException('이미 보상을 수령한 이벤트입니다.');
                case 'PENDING':
                    throw new common_2.BadRequestException('보상 요청이 처리 중입니다.');
                case 'FAILED':
                    throw new common_2.BadRequestException('보상 조건을 만족하지 않아 수령할 수 없습니다.');
            }
        }
        const user = await this.userService.getUserInfo(dto.userId);
        const event = await this.eventService.findById(eventId);
        const now = new Date();
        if (now < new Date(event.startDate) || now > new Date(event.endDate)) {
            throw new common_2.BadRequestException('이벤트 기간이 아닙니다.');
        }
        const passed = this.conditionEvaluator.evaluate(event.conditions, user);
        if (!passed) {
            throw new common_2.BadRequestException('보상 조건을 만족하지 않아 수령할 수 없습니다.');
        }
        const result = await this.claimService.createPendingClaim({ ...dto, eventId }, passed, '조건 충족');
        return this.mapToClaimResponse(result);
    }
    async updateClaimStatus(eventId, claimId, body) {
        const claim = await this.claimService.updateStatus(claimId, body.status, body.reason);
        return this.mapToClaimResponse(claim);
    }
    async getClaimsByUser(userId) {
        const claims = await this.claimService.findByUser(userId);
        return claims.map((c) => this.mapToClaimResponse(c));
    }
    async getAllClaims() {
        const claims = await this.claimService.findAll();
        return claims.map((c) => this.mapToClaimResponse(c));
    }
};
exports.EventController = EventController;
__decorate([
    (0, common_1.Post)('events'),
    (0, roles_decorator_1.Roles)('OPERATOR', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: '이벤트 생성' }),
    (0, swagger_1.ApiBody)({ type: create_event_dto_1.CreateEventDto }),
    (0, swagger_1.ApiResponse)({ status: 201, type: response_event_dto_1.ResponseEventDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof create_event_dto_1.CreateEventDto !== "undefined" && create_event_dto_1.CreateEventDto) === "function" ? _f : Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], EventController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Get)('events'),
    (0, swagger_1.ApiOperation)({ summary: '이벤트 전체 조회' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [response_event_dto_1.ResponseEventDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], EventController.prototype, "getAllEvents", null);
__decorate([
    (0, common_1.Get)('events/:id'),
    (0, swagger_1.ApiOperation)({ summary: '이벤트 상세 조회 (보상 포함)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_event_dto_1.ResponseEventDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], EventController.prototype, "getEventById", null);
__decorate([
    (0, common_1.Put)('events/:id'),
    (0, roles_decorator_1.Roles)('OPERATOR', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: '이벤트 수정' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiBody)({ type: update_event_dto_1.UpdateEventDto }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_event_dto_1.ResponseEventDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_k = typeof update_event_dto_1.UpdateEventDto !== "undefined" && update_event_dto_1.UpdateEventDto) === "function" ? _k : Object]),
    __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], EventController.prototype, "updateEvent", null);
__decorate([
    (0, common_1.Patch)('events/:id/active'),
    (0, roles_decorator_1.Roles)('OPERATOR', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: '이벤트 활성화 상태 토글' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_event_dto_1.ResponseEventDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], EventController.prototype, "toggleEventActive", null);
__decorate([
    (0, common_1.Post)('events/:eventId/rewards'),
    (0, roles_decorator_1.Roles)('OPERATOR', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: '보상 등록' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', type: String }),
    (0, swagger_1.ApiBody)({ type: create_reward_dto_1.CreateRewardDto }),
    (0, swagger_1.ApiResponse)({ status: 201, type: response_reward_dto_1.RewardResponseDto }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_o = typeof Omit !== "undefined" && Omit) === "function" ? _o : Object]),
    __metadata("design:returntype", typeof (_p = typeof Promise !== "undefined" && Promise) === "function" ? _p : Object)
], EventController.prototype, "createReward", null);
__decorate([
    (0, common_1.Put)('events/:eventId/rewards/:rewardId'),
    (0, roles_decorator_1.Roles)('OPERATOR', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: '보상 수정' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', type: String }),
    (0, swagger_1.ApiParam)({ name: 'rewardId', type: String }),
    (0, swagger_1.ApiBody)({ type: update_reward_dto_1.UpdateRewardDto }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_reward_dto_1.RewardResponseDto }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Param)('rewardId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, typeof (_q = typeof update_reward_dto_1.UpdateRewardDto !== "undefined" && update_reward_dto_1.UpdateRewardDto) === "function" ? _q : Object]),
    __metadata("design:returntype", typeof (_r = typeof Promise !== "undefined" && Promise) === "function" ? _r : Object)
], EventController.prototype, "updateReward", null);
__decorate([
    (0, common_1.Delete)('events/:eventId/rewards/:rewardId'),
    (0, roles_decorator_1.Roles)('OPERATOR', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: '보상 삭제' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', type: String }),
    (0, swagger_1.ApiParam)({ name: 'rewardId', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Param)('rewardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "deleteReward", null);
__decorate([
    (0, common_1.Post)('events/:eventId/claims'),
    (0, roles_decorator_1.Roles)('USER'),
    (0, swagger_1.ApiOperation)({ summary: '유저 보상 요청' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', type: String }),
    (0, swagger_1.ApiBody)({ type: claim_reward_dto_1.ClaimRewardDto }),
    (0, swagger_1.ApiResponse)({ status: 201, type: response_claim_dto_1.ClaimResponseDto }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_s = typeof Omit !== "undefined" && Omit) === "function" ? _s : Object]),
    __metadata("design:returntype", typeof (_t = typeof Promise !== "undefined" && Promise) === "function" ? _t : Object)
], EventController.prototype, "claimReward", null);
__decorate([
    (0, common_1.Patch)('events/:eventId/claims/:claimId/status'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: '보상 처리 상태 변경' }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Param)('claimId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, typeof (_u = typeof update_claim_status_dto_1.UpdateClaimStatusDto !== "undefined" && update_claim_status_dto_1.UpdateClaimStatusDto) === "function" ? _u : Object]),
    __metadata("design:returntype", typeof (_v = typeof Promise !== "undefined" && Promise) === "function" ? _v : Object)
], EventController.prototype, "updateClaimStatus", null);
__decorate([
    (0, common_1.Get)('claims/user/:userId'),
    (0, roles_decorator_1.Roles)('USER', 'AUDITOR', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: '특정 유저의 보상 이력 조회' }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [response_claim_dto_1.ClaimResponseDto] }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_w = typeof Promise !== "undefined" && Promise) === "function" ? _w : Object)
], EventController.prototype, "getClaimsByUser", null);
__decorate([
    (0, common_1.Get)('claims'),
    (0, roles_decorator_1.Roles)('AUDITOR', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: '전체 보상 이력 조회' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [response_claim_dto_1.ClaimResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_x = typeof Promise !== "undefined" && Promise) === "function" ? _x : Object)
], EventController.prototype, "getAllClaims", null);
exports.EventController = EventController = __decorate([
    (0, swagger_1.ApiTags)('Event API'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof event_service_1.EventService !== "undefined" && event_service_1.EventService) === "function" ? _a : Object, typeof (_b = typeof reward_service_1.RewardService !== "undefined" && reward_service_1.RewardService) === "function" ? _b : Object, typeof (_c = typeof claim_service_1.ClaimService !== "undefined" && claim_service_1.ClaimService) === "function" ? _c : Object, typeof (_d = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _d : Object, typeof (_e = typeof condition_evaluator_1.ConditionEvaluator !== "undefined" && condition_evaluator_1.ConditionEvaluator) === "function" ? _e : Object])
], EventController);


/***/ }),
/* 7 */
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
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(4);
const mongoose_2 = __webpack_require__(8);
const event_schema_1 = __webpack_require__(9);
let EventService = class EventService {
    constructor(eventModel) {
        this.eventModel = eventModel;
    }
    async create(dto) {
        const created = new this.eventModel(dto);
        return created.save();
    }
    async update(id, dto) {
        const updated = await this.eventModel
            .findByIdAndUpdate(id, dto, { new: true })
            .exec();
        if (!updated) {
            throw new common_1.NotFoundException('해당 이벤트를 찾을 수 없습니다.');
        }
        return updated;
    }
    async toggleActive(id) {
        const event = await this.eventModel.findById(id).exec();
        if (!event) {
            throw new common_1.NotFoundException('해당 이벤트를 찾을 수 없습니다.');
        }
        event.isActive = !event.isActive;
        return event.save();
    }
    async findAll() {
        return this.eventModel.find().sort({ createdAt: -1 }).exec();
    }
    async findById(id) {
        const event = await this.eventModel.findById(id).exec();
        if (!event) {
            throw new common_1.NotFoundException('해당 이벤트를 찾을 수 없습니다.');
        }
        return event;
    }
    async validateEventExists(id) {
        const exists = await this.eventModel.exists({ _id: id });
        if (!exists) {
            throw new common_1.NotFoundException('해당 이벤트를 찾을 수 없습니다.');
        }
    }
};
exports.EventService = EventService;
exports.EventService = EventService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(event_schema_1.Event.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], EventService);


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 9 */
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventSchema = exports.Event = void 0;
const mongoose_1 = __webpack_require__(4);
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
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['ON_DEMAND', 'AUTO'],
        default: 'ON_DEMAND',
    }),
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
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Event.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Event.prototype, "updatedAt", void 0);
exports.Event = Event = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Event);
exports.EventSchema = mongoose_1.SchemaFactory.createForClass(Event);


/***/ }),
/* 10 */
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
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(4);
const mongoose_2 = __webpack_require__(8);
const reward_schema_1 = __webpack_require__(11);
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
    async update(eventId, rewardId, dto) {
        const reward = await this.rewardModel
            .findOneAndUpdate({ _id: rewardId, eventId }, { $set: dto }, { new: true })
            .exec();
        if (!reward) {
            throw new common_1.NotFoundException('해당 보상을 찾을 수 없거나 이벤트에 속하지 않습니다.');
        }
        return reward;
    }
    async delete(eventId, rewardId) {
        const result = await this.rewardModel
            .findOneAndDelete({ _id: rewardId, eventId })
            .exec();
        if (!result) {
            throw new common_1.NotFoundException('해당 보상을 찾을 수 없거나 이벤트에 속하지 않습니다.');
        }
        return { success: true };
    }
};
exports.RewardService = RewardService;
exports.RewardService = RewardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(reward_schema_1.Reward.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], RewardService);


/***/ }),
/* 11 */
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RewardSchema = exports.Reward = void 0;
const mongoose_1 = __webpack_require__(4);
const mongoose_2 = __webpack_require__(8);
const event_schema_1 = __webpack_require__(9);
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
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Reward.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Reward.prototype, "updatedAt", void 0);
exports.Reward = Reward = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Reward);
exports.RewardSchema = mongoose_1.SchemaFactory.createForClass(Reward);


/***/ }),
/* 12 */
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
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(4);
const mongoose_2 = __webpack_require__(8);
const claim_schema_1 = __webpack_require__(13);
const event_service_1 = __webpack_require__(7);
const reward_service_1 = __webpack_require__(10);
const condition_evaluator_1 = __webpack_require__(14);
const user_service_1 = __webpack_require__(15);
let ClaimService = class ClaimService {
    constructor(claimModel, eventService, rewardService, conditionEvaluator, userService) {
        this.claimModel = claimModel;
        this.eventService = eventService;
        this.rewardService = rewardService;
        this.conditionEvaluator = conditionEvaluator;
        this.userService = userService;
    }
    async hasClaimed(userId, eventId) {
        const existing = await this.claimModel.findOne({ userId, eventId }).exec();
        return !!existing;
    }
    async findOne(userId, eventId) {
        return this.claimModel.findOne({ userId, eventId }).exec();
    }
    async createPendingClaim(dto, status, reason) {
        const rewards = await this.rewardService.findByEvent(dto.eventId);
        const claim = new this.claimModel({
            userId: dto.userId,
            eventId: dto.eventId,
            status: 'PENDING',
            reason,
            rewardsGiven: status ? rewards.flatMap((r) => r.rewards) : [],
        });
        return claim.save();
    }
    async updateStatus(claimId, status, reason) {
        const claim = await this.claimModel.findById(claimId);
        if (!claim) {
            throw new common_1.NotFoundException('해당 보상 요청을 찾을 수 없습니다.');
        }
        claim.status = status;
        if (reason)
            claim.reason = reason;
        return claim.save();
    }
    async findAll() {
        return this.claimModel.find().exec();
    }
    async findByUser(userId) {
        return this.claimModel.find({ userId }).exec();
    }
    async validateEventExists(eventId) {
        const event = await this.eventService.findById(eventId);
        if (!event) {
            throw new common_1.NotFoundException('해당 이벤트를 찾을 수 없습니다.');
        }
    }
    async validateUserInfo(userId) {
        const user = await this.userService.getUserInfo(userId);
        if (!user) {
            throw new common_1.NotFoundException('해당 유저를 찾을 수 없습니다.');
        }
        return user;
    }
};
exports.ClaimService = ClaimService;
exports.ClaimService = ClaimService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(claim_schema_1.Claim.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof event_service_1.EventService !== "undefined" && event_service_1.EventService) === "function" ? _b : Object, typeof (_c = typeof reward_service_1.RewardService !== "undefined" && reward_service_1.RewardService) === "function" ? _c : Object, typeof (_d = typeof condition_evaluator_1.ConditionEvaluator !== "undefined" && condition_evaluator_1.ConditionEvaluator) === "function" ? _d : Object, typeof (_e = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _e : Object])
], ClaimService);


/***/ }),
/* 13 */
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClaimSchema = exports.Claim = void 0;
const mongoose_1 = __webpack_require__(4);
const mongoose_2 = __webpack_require__(8);
const event_schema_1 = __webpack_require__(9);
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
__decorate([
    (0, mongoose_1.Prop)({ type: Array }),
    __metadata("design:type", Array)
], Claim.prototype, "rewardsGiven", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Claim.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Claim.prototype, "updatedAt", void 0);
exports.Claim = Claim = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Claim);
exports.ClaimSchema = mongoose_1.SchemaFactory.createForClass(Claim);


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConditionEvaluator = void 0;
const common_1 = __webpack_require__(3);
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
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const common_1 = __webpack_require__(3);
let UserService = class UserService {
    async getUserInfo(userId) {
        return {
            userId,
            level: 290,
            achievements: [
                'EXTREME_KALLOS_CLEAR',
                'DAILY_LOGIN_365',
                'PUNCHKING_TOP10_LARA',
            ],
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);


/***/ }),
/* 16 */
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
const class_validator_1 = __webpack_require__(17);
const class_transformer_1 = __webpack_require__(18);
const swagger_1 = __webpack_require__(19);
class ComparisonConditionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'comparison' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComparisonConditionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'level', description: '조건을 검사할 유저 속성' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComparisonConditionDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['>=', '<=', '>', '<', '==', '!='], example: '>=' }),
    (0, class_validator_1.IsEnum)(['>=', '<=', '>', '<', '==', '!=']),
    __metadata("design:type", String)
], ComparisonConditionDto.prototype, "operator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '비교할 값', example: 200 }),
    __metadata("design:type", Object)
], ComparisonConditionDto.prototype, "value", void 0);
class AchievementConditionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'achievement' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AchievementConditionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DAILY_LOGIN_365', description: '달성한 업적 ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AchievementConditionDto.prototype, "achievementId", void 0);
class CreateEventDto {
}
exports.CreateEventDto = CreateEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '익스트림 칼로스 처치 이벤트' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '익스트림 칼로스를 처치하면 쇼케이스 티켓을 드립니다',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['ON_DEMAND', 'AUTO'], example: 'ON_DEMAND' }),
    (0, class_validator_1.IsEnum)(['ON_DEMAND', 'AUTO']),
    __metadata("design:type", String)
], CreateEventDto.prototype, "triggerType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '이벤트 조건들',
        type: [Object],
        example: [{ type: 'achievement', achievementId: 'EXTREME_KALLOS_CLEAR' }],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Object),
    __metadata("design:type", Array)
], CreateEventDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-05-01T00:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-07T23:59:59Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateEventDto.prototype, "isActive", void 0);


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateEventDto = void 0;
const mapped_types_1 = __webpack_require__(21);
const create_event_dto_1 = __webpack_require__(16);
class UpdateEventDto extends (0, mapped_types_1.PartialType)(create_event_dto_1.CreateEventDto) {
}
exports.UpdateEventDto = UpdateEventDto;


/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("@nestjs/mapped-types");

/***/ }),
/* 22 */
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
const class_validator_1 = __webpack_require__(17);
const class_transformer_1 = __webpack_require__(18);
const swagger_1 = __webpack_require__(19);
const reward_item_dto_1 = __webpack_require__(23);
class CreateRewardDto {
}
exports.CreateRewardDto = CreateRewardDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '이벤트 ID',
        example: '6647dc3b4d2e5b7fbc9c1e3a',
    }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateRewardDto.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [reward_item_dto_1.RewardItemDto], description: '보상 항목 목록' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => reward_item_dto_1.RewardItemDto),
    __metadata("design:type", Array)
], CreateRewardDto.prototype, "rewards", void 0);


/***/ }),
/* 23 */
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
exports.RewardItemResponseDto = exports.RewardItemDto = exports.RewardItemBaseDto = void 0;
const swagger_1 = __webpack_require__(19);
const class_validator_1 = __webpack_require__(17);
class RewardItemBaseDto {
}
exports.RewardItemBaseDto = RewardItemBaseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['item', 'point', 'coupon'],
        description: '보상 타입',
        example: 'item',
    }),
    (0, class_validator_1.IsIn)(['item', 'point', 'coupon']),
    __metadata("design:type", String)
], RewardItemBaseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '보상 값', example: 'ITEM123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RewardItemBaseDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '수량', example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], RewardItemBaseDto.prototype, "quantity", void 0);
class RewardItemDto extends RewardItemBaseDto {
}
exports.RewardItemDto = RewardItemDto;
class RewardItemResponseDto extends RewardItemBaseDto {
}
exports.RewardItemResponseDto = RewardItemResponseDto;


/***/ }),
/* 24 */
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
exports.UpdateRewardDto = void 0;
const class_validator_1 = __webpack_require__(17);
const class_transformer_1 = __webpack_require__(18);
const swagger_1 = __webpack_require__(19);
class RewardItemDto {
}
class UpdateRewardDto {
}
exports.UpdateRewardDto = UpdateRewardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RewardItemDto], description: '보상 항목 목록' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RewardItemDto),
    __metadata("design:type", Array)
], UpdateRewardDto.prototype, "rewards", void 0);


/***/ }),
/* 25 */
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
const class_validator_1 = __webpack_require__(17);
const swagger_1 = __webpack_require__(19);
class ClaimRewardDto {
}
exports.ClaimRewardDto = ClaimRewardDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '이벤트 ID',
        example: '6647dc3b4d2e5b7fbc9c1e3a',
    }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], ClaimRewardDto.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '유저 ID', example: 'test-user-123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ClaimRewardDto.prototype, "userId", void 0);


/***/ }),
/* 26 */
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
exports.UpdateClaimStatusDto = void 0;
const swagger_1 = __webpack_require__(19);
const class_validator_1 = __webpack_require__(17);
class UpdateClaimStatusDto {
}
exports.UpdateClaimStatusDto = UpdateClaimStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['SUCCESS', 'FAILED'], description: '보상 처리 상태' }),
    (0, class_validator_1.IsEnum)(['SUCCESS', 'FAILED']),
    __metadata("design:type", String)
], UpdateClaimStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '사유', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClaimStatusDto.prototype, "reason", void 0);


/***/ }),
/* 27 */
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
exports.ResponseEventDto = void 0;
const swagger_1 = __webpack_require__(19);
const reward_item_dto_1 = __webpack_require__(23);
class ComparisonConditionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'comparison' }),
    __metadata("design:type", String)
], ComparisonConditionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'level' }),
    __metadata("design:type", String)
], ComparisonConditionDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '>=',
        enum: ['>=', '<=', '>', '<', '==', '!='],
    }),
    __metadata("design:type", String)
], ComparisonConditionDto.prototype, "operator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 260 }),
    __metadata("design:type", Object)
], ComparisonConditionDto.prototype, "value", void 0);
class AchievementConditionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'achievement' }),
    __metadata("design:type", String)
], AchievementConditionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ANOTHER_POWER_6' }),
    __metadata("design:type", String)
], AchievementConditionDto.prototype, "achievementId", void 0);
let ResponseEventDto = class ResponseEventDto {
};
exports.ResponseEventDto = ResponseEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '665001f8f3a8a9b9f5cdab12' }),
    __metadata("design:type", String)
], ResponseEventDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '레벨 달성 이벤트' }),
    __metadata("design:type", String)
], ResponseEventDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '260 이상 달성시 보상 지급' }),
    __metadata("design:type", String)
], ResponseEventDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ON_DEMAND' }),
    __metadata("design:type", String)
], ResponseEventDto.prototype, "triggerType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        oneOf: [
            { $ref: (0, swagger_1.getSchemaPath)(ComparisonConditionDto) },
            { $ref: (0, swagger_1.getSchemaPath)(AchievementConditionDto) },
        ],
        isArray: true,
    }),
    __metadata("design:type", Array)
], ResponseEventDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-01T00:00:00Z' }),
    __metadata("design:type", String)
], ResponseEventDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-30T23:59:59Z' }),
    __metadata("design:type", String)
], ResponseEventDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ResponseEventDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [reward_item_dto_1.RewardItemResponseDto],
        description: '이벤트에 등록된 보상 목록',
    }),
    __metadata("design:type", Array)
], ResponseEventDto.prototype, "rewards", void 0);
exports.ResponseEventDto = ResponseEventDto = __decorate([
    (0, swagger_1.ApiExtraModels)(ComparisonConditionDto, AchievementConditionDto)
], ResponseEventDto);


/***/ }),
/* 28 */
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
exports.RewardResponseDto = exports.RewardItemResponseDto = void 0;
const swagger_1 = __webpack_require__(19);
class RewardItemResponseDto {
}
exports.RewardItemResponseDto = RewardItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['item', 'point', 'coupon'],
        example: 'item',
        description: '보상 타입: 아이템, 포인트, 쿠폰 중 하나',
    }),
    __metadata("design:type", String)
], RewardItemResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'ITEM_CODE_001',
        description: '보상의 고유 값 (아이템 코드, 포인트 종류 등)',
    }),
    __metadata("design:type", String)
], RewardItemResponseDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: '지급 수량',
    }),
    __metadata("design:type", Number)
], RewardItemResponseDto.prototype, "quantity", void 0);
class RewardResponseDto {
}
exports.RewardResponseDto = RewardResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '665005c132e438c4bc93aa7d',
        description: 'Reward 문서의 MongoDB ObjectId',
    }),
    __metadata("design:type", String)
], RewardResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '665001f8f3a8a9b9f5cdab12',
        description: '해당 보상이 연결된 이벤트의 ID',
    }),
    __metadata("design:type", String)
], RewardResponseDto.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [RewardItemResponseDto],
        description: '보상 항목 배열',
    }),
    __metadata("design:type", Array)
], RewardResponseDto.prototype, "rewards", void 0);


/***/ }),
/* 29 */
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
exports.ClaimResponseDto = void 0;
const swagger_1 = __webpack_require__(19);
const reward_item_dto_1 = __webpack_require__(23);
class ClaimResponseDto {
}
exports.ClaimResponseDto = ClaimResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '665005c132e438c4bc93aa7d' }),
    __metadata("design:type", String)
], ClaimResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-abc-123' }),
    __metadata("design:type", String)
], ClaimResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'event-xyz-456' }),
    __metadata("design:type", String)
], ClaimResponseDto.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['SUCCESS', 'FAILED', 'PENDING'],
        example: 'SUCCESS',
    }),
    __metadata("design:type", String)
], ClaimResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '조건 충족' }),
    __metadata("design:type", String)
], ClaimResponseDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [reward_item_dto_1.RewardItemResponseDto],
        required: false,
        description: '성공한 경우 지급된 보상 목록',
    }),
    __metadata("design:type", Array)
], ClaimResponseDto.prototype, "rewardsGiven", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-01T00:00:00Z' }),
    __metadata("design:type", String)
], ClaimResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-01T00:00:00Z' }),
    __metadata("design:type", String)
], ClaimResponseDto.prototype, "updatedAt", void 0);


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = void 0;
const common_1 = __webpack_require__(3);
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;


/***/ }),
/* 31 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 32 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 33 */
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
const common_1 = __webpack_require__(3);
const passport_1 = __webpack_require__(32);
const passport_jwt_1 = __webpack_require__(34);
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
/* 34 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(3);
const passport_1 = __webpack_require__(32);
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
/* 36 */
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
const common_1 = __webpack_require__(3);
const core_1 = __webpack_require__(1);
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


/***/ })
/******/ 	]);
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

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const event_module_1 = __webpack_require__(2);
const common_1 = __webpack_require__(3);
const jwt_auth_guard_1 = __webpack_require__(35);
const roles_guard_1 = __webpack_require__(36);
const core_2 = __webpack_require__(1);
const swagger_1 = __webpack_require__(19);
async function bootstrap() {
    const app = await core_1.NestFactory.create(event_module_1.EventModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    const reflector = app.get(core_2.Reflector);
    app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(), new roles_guard_1.RolesGuard(reflector));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Maple Event API')
        .setDescription('이벤트 및 보상 API 문서')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    await app.listen(3002);
}
bootstrap();

})();

/******/ })()
;