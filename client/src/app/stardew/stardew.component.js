"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var SVSaveParser_service_1 = require("./SVSaveParser.service");
var StardewComponent = (function () {
    function StardewComponent() {
        this.farm = { name: 'farmname' };
        this.fileParsed = false;
    }
    StardewComponent.prototype.ngOnInit = function () {
    };
    StardewComponent.prototype.processFile = function (file) {
        var _this = this;
        if (!file) {
            return;
        }
        this.fileName = file.name;
        var reader = new FileReader();
        reader.onload = function (event) {
            console.log(reader.result.length);
            var parser = new DOMParser();
            var doc = parser.parseFromString(reader.result, 'application/xml');
            console.log(doc);
            window['doc'] = doc;
            var player = doc.evaluate('/SaveGame/player', doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            console.log(player);
            // const obj = this.xmlToJSON(doc);
            // console.log(obj);
            var svParser = new SVSaveParser_service_1.SVSaveParser(doc);
            _this.player = svParser.getPlayer();
            console.log(_this.player);
            _this.fileParsed = true;
        };
        reader.readAsText(file);
    };
    StardewComponent.prototype.xmlToJSON = function (xml) {
        var obj = {};
        if (xml.nodeType === 1) {
            if (xml.attributes.length > 0) {
                console.log("IMPLEMENT ME");
            }
        }
        else if (xml.nodeType === 3) {
            obj = xml.nodeValue;
        }
        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var child = xml.childNodes.item(i);
                var nodeName = child.nodeName;
                if (!obj[nodeName]) {
                    obj[nodeName] = this.xmlToJSON(child);
                }
                else {
                    if (typeof obj[nodeName].push === 'undefined') {
                        var old = obj[nodeName];
                        obj[nodeName] = [old];
                    }
                    obj[nodeName].push(this.xmlToJSON(child));
                }
            }
        }
        return obj;
    };
    return StardewComponent;
}());
StardewComponent = __decorate([
    core_1.Component({
        selector: 'app-stardew',
        templateUrl: './stardew.component.html',
        styleUrls: ['./stardew.component.sass']
    })
], StardewComponent);
exports.StardewComponent = StardewComponent;
