"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var XMLParser_service_1 = require("../XMLParser.service");
var Player = (function () {
    function Player() {
        this.name = undefined;
        this.farmName = undefined;
        this.favoriteThing = undefined;
        this.shirt = undefined;
        this.hair = undefined;
        this.skin = undefined;
        this.accessory = undefined;
        this.facialHair = undefined;
    }
    return Player;
}());
exports.Player = Player;
exports.p = {};
console.log(exports.p.player);
var SVSaveParser = (function (_super) {
    __extends(SVSaveParser, _super);
    function SVSaveParser(saveGameXML) {
        return _super.call(this, saveGameXML) || this;
    }
    SVSaveParser.prototype.getPlayer = function () {
        if (!this.player) {
            var player = this.getNode('/player');
            this.player = new Player();
            for (var attr in this.player) {
                console.log(attr);
                this.player[attr] = this.getText("./" + attr, player);
            }
            var questNodes = this.getNodes('./questLog/Quest', player);
            this.player.questLog = [];
            for (var _i = 0, questNodes_1 = questNodes; _i < questNodes_1.length; _i++) {
                var questNode = questNodes_1[_i];
                this.player.questLog.push({
                    type: this.getAttribute('xsi:type', questNode),
                    description: this.getText('./questDescription', questNode),
                    title: this.getText('./questTitle', questNode)
                });
            }
        }
        return this.player;
    };
    // public getFarm(): IFarm {
    //     retrun
    // }
    SVSaveParser.prototype.evaluate = function (xPath, base, resultType) {
        if (resultType === void 0) { resultType = XPathResult.ANY_TYPE; }
        if (!base) {
            xPath = "/SaveGame" + xPath;
        }
        return _super.prototype.evaluate.call(this, xPath, base, resultType);
    };
    return SVSaveParser;
}(XMLParser_service_1.XMLParser));
exports.SVSaveParser = SVSaveParser;
