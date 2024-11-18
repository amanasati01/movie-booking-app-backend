"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userContoller_1 = require("../controllers/userContoller");
const userDetails_1 = __importDefault(require("../controllers/userDetails"));
const ticketDetails_1 = __importDefault(require("../controllers/ticketDetails"));
const router = (0, express_1.Router)();
router.route('/register').post(userContoller_1.registerUser);
router.route('/login').post(userContoller_1.loginUser);
router.route('/logout').get(userContoller_1.logoutUser);
router.route('/userDetails').get(userDetails_1.default);
router.route('/ticketDetails').get(ticketDetails_1.default);
exports.default = router;
