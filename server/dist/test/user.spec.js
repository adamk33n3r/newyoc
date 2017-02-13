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
const mocha_typescript_1 = require("mocha-typescript");
const user_1 = require("../src/schemas/user");
const mongoose = require("mongoose");
let UserTest = UserTest_1 = class UserTest {
    constructor() {
        this.data = {
            email: 'foo@bar.com',
            firstName: 'Brian',
            lastName: 'Love'
        };
    }
    static before() {
        //use q promises
        global.Promise = require('q').Promise;
        //use q library for mongoose promise
        mongoose.Promise = global.Promise;
        //connect to mongoose and create model
        const MONGODB_CONNECTION = 'mongodb://localhost:27017/heros';
        let connection = mongoose.createConnection(MONGODB_CONNECTION);
        UserTest_1.User = connection.model('User', user_1.userSchema);
        //require chai and use should() assertions
        let chai = require('chai');
        chai.should();
    }
    create() {
        //create user and return promise
        return new UserTest_1.User(this.data).save().then(result => {
            //verify _id property exists
            result._id.should.exist;
            //verify email
            result.email.should.equal(this.data.email);
            //verify firstName
            result.firstName.should.equal(this.data.firstName);
            //verify lastName
            result.lastName.should.equal(this.data.lastName);
        });
    }
};
__decorate([
    mocha_typescript_1.test('should create a new User'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserTest.prototype, "create", null);
UserTest = UserTest_1 = __decorate([
    mocha_typescript_1.suite,
    __metadata("design:paramtypes", [])
], UserTest);
var UserTest_1;
//# sourceMappingURL=C:/cygwin/home/Adam/projects/newyoc/server/test/user.spec.js.map