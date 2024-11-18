"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUser = setUser;
exports.getUser = getUser;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET || '';
function setUser(user) {
    return jsonwebtoken_1.default.sign({
        email: user.email,
    }, SECRET, {
        expiresIn: '7d'
    });
}
function getUser(token) {
    if (!token) {
        return null;
    }
    ;
    return jsonwebtoken_1.default.verify(token, SECRET);
}
