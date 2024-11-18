"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seatBook_1 = __importDefault(require("../controllers/seatBook"));
const theaterGeneration_1 = __importDefault(require("../controllers/theaterGeneration"));
const seatBlock_1 = __importDefault(require("../controllers/seatBlock"));
const makeSeatAvailable_1 = __importDefault(require("../controllers/makeSeatAvailable"));
const seatData_1 = __importDefault(require("../controllers/seatData"));
const routes = (0, express_1.Router)();
// routes.route('/book-ticket').post(CheckLogin,bookTicket)
routes.route('/book-ticket').post(seatBook_1.default);
routes.route('/generate-theater').post(theaterGeneration_1.default);
routes.route('/seatsData').post(seatData_1.default);
routes.route('/block-the-seat').post(seatBlock_1.default);
routes.route('/make-seat-available').post(makeSeatAvailable_1.default);
exports.default = routes;
