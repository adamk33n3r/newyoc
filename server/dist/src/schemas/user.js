"use strict";
const mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    createdAt: Date,
    email: String,
    firstName: String,
    lastName: String,
});
exports.userSchema.pre('save', (next) => {
    if (!this.createdAt) {
        this.createdAt = new Date();
    }
    next();
});
//# sourceMappingURL=C:/cygwin/home/Adam/projects/newyoc/server/src/schemas/user.js.map