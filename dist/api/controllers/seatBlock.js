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
exports.default = blockTheSeat;
const Seats_1 = require("../utils/Seats");
function blockTheSeat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Request have reached at block seat route");
            const seatId = req.body;
            console.log("seat id arr -> ", seatId.id);
            setTimeout(() => {
                function makeAvailable() {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const results = yield Promise.all(seatId.id.map((ele) => __awaiter(this, void 0, void 0, function* () {
                                const done = yield (0, Seats_1.seatAvailable)(ele);
                                console.log("done ->", done);
                                return done;
                            })));
                            console.log("All done:", results);
                        }
                        catch (error) {
                            console.error("Error making seats available:", error);
                        }
                    });
                }
                makeAvailable();
            }, 10000);
            const updatedSeat = yield (0, Seats_1.seatBlock)(seatId.id);
            res.status(201).json({
                statusCode: 201,
                message: "successfull",
                updatedSeat,
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
