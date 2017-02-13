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
const util_1 = require("src/decorators/util");
const teamspeak_1 = require("src/services/teamspeak");
const slack_1 = require("src/services/slack");
const config_1 = require("src/config");
let SlackController = class SlackController {
    constructor() {
        this.slack = new slack_1.Slack();
    }
    status(req, res) {
        const ts = this.initTeamSpeak();
        ts.login(config_1.default.teamspeak.username, config_1.default.teamspeak.password)
            .then(() => {
            ts.getOnlineClients()
                .then((onlineClients) => {
                const connectURL = 'TeamSpeak Server\n<ts3server://ts.adam-keenan.com|Click here to connect!>\n';
                if (onlineClients.length > 0) {
                    res.send({
                        response_type: 'ephemeral',
                        text: connectURL + 'Online users: ' +
                            onlineClients.map((ele) => {
                                return ele.client_nickname;
                            }).join(', '),
                    });
                }
                else {
                    res.send({
                        response_type: 'ephemeral',
                        text: connectURL + 'No one is online at the moment',
                    });
                }
            })
                .catch((err) => res.status(500).send(err));
        })
            .catch((err) => res.status(500).send(err));
    }
    sendMessage(req, res) {
        this.slack.sendMessage(config_1.default.slack.webhook, {
            channel: req.body.channel || '#tcpi',
            text: req.body.text || 'No text provided',
        })
            .then((response) => {
            const body = JSON.parse(response.body);
            if (body.ok) {
                res.json({ success: true, body: response.body });
            }
            else {
                console.error(response);
            }
        })
            .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
    }
    roll(req, res) {
        const sides = req.body.text.split(' ')[0];
        if (sides) {
            const result = Math.floor(Math.random() * +sides) + 1;
            if (!result) {
                return res.status(500).send('Sides parameter invalid');
            }
            res.send({
                response_type: 'in_channel',
                text: result,
            });
        }
        else {
            res.status(500).send('Sides parameter invalid');
        }
    }
    lenny(req, res) {
        res.send({
            response_type: 'in_channel',
            text: ' ',
        });
    }
    sendInvite(req, res) {
        if (!this.slack) {
            console.error(this.slack);
            return res.send(500, 'uh');
        }
        this.slack.sendInvite(config_1.default.slack.token, req.body.email)
            .then((response) => {
            const body = JSON.parse(response.body);
            if (body.ok) {
                res.json({ success: true, body });
            }
            else {
                console.error(body.error);
                res.json({ success: false, body });
            }
        })
            .catch((err) => {
            console.error(err.statusCode);
            res.status(500).send();
        });
    }
    initTeamSpeak() {
        return new teamspeak_1.TeamSpeak(config_1.default.teamspeak.url);
    }
};
__decorate([
    routing_1.GET(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SlackController.prototype, "status", null);
__decorate([
    routing_1.POST(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SlackController.prototype, "sendMessage", null);
__decorate([
    routing_1.POST(),
    util_1.Required('text'),
    util_1.CheckToken('LwPEBbxlGiNTXzXG7Ag92Efo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SlackController.prototype, "roll", null);
__decorate([
    routing_1.POST(),
    util_1.CheckToken('HEiSGKnFX8aGHXezPxnER2Mg'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SlackController.prototype, "lenny", null);
__decorate([
    routing_1.POST(),
    util_1.Required('email'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SlackController.prototype, "sendInvite", null);
SlackController = __decorate([
    routing_1.Controller('/slack')
], SlackController);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new SlackController();
//# sourceMappingURL=C:/cygwin/home/Adam/projects/newyoc/server/src/api/services/slack.js.map