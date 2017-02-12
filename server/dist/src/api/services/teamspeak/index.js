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
const routing_1 = require("src/decorators/routing");
let TeamSpeakController = class TeamSpeakController {
    index(req, res) {
        res.send({ omg: 'yes' });
    }
    clients(req, res) {
        res.send(['adam', 'josh']);
    }
    kick(req, res) { }
};
__decorate([
    routing_1.GET('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TeamSpeakController.prototype, "index", null);
__decorate([
    routing_1.GET(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TeamSpeakController.prototype, "clients", null);
__decorate([
    routing_1.POST(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TeamSpeakController.prototype, "kick", null);
TeamSpeakController = __decorate([
    routing_1.Controller('/teamspeak')
], TeamSpeakController);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new TeamSpeakController();
//# sourceMappingURL=/home/adam/projects/newyoc/server/src/api/services/teamspeak/index.js.map