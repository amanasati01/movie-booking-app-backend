"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = makeSeatAvailable;
const Seats_1 = require("../utils/Seats");
function makeSeatAvailable(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const seatId = req.body;
            const updatedSeat = yield (0, Seats_1.seatAvailable)(seatId.id);
            res.status(201).json({
                statusCode: 201,
                message: "successfull",
                updatedSeat,
                id: seatId.id
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    satusCoce: 500,
                    messsage: error.message
                });
            }
            else {
                res.status(500).json({
                    satusCode: 500,
                    messsage: "Unexpected error occured"
                });
            }
        }
    });
}
