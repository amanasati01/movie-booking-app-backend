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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bookTicket;
const Seats_1 = require("../utils/Seats");
const Prisma_1 = __importDefault(require("../utils/Prisma"));
function bookTicket(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const seatId = req.body;
            // Update seat booking
            const updatedSeat = yield (0, Seats_1.seatBook)(seatId.id);
            // Fetch seat details with Promise.all
            const seatDetails = yield Promise.all(seatId.id.map((id) => Prisma_1.default.seat.findUnique({
                where: { id },
                select: {
                    number: true,
                    seatType: true,
                },
            })));
            const validSeatDetails = seatDetails.filter((seat) => seat !== null);
            // Add amount based on seatType
            const seatDetailsWithAmount = validSeatDetails.map((seat) => {
                let amount = 100;
                if (seat.seatType === "boxA")
                    amount = 2000;
                else if (seat.seatType === "boxF")
                    amount = 150;
                return Object.assign(Object.assign({}, seat), { amount });
            });
            const ticketData = seatDetailsWithAmount.map((seat) => ({
                movie: seatId.movie,
                theater: seatId.theater,
                buyerId: seatId.buyerId,
                startAt: seatId.startAt,
                seatType: seat.seatType,
                endAt: seatId.endAt,
                seatNo: seat.number,
                amount: seat.amount,
            }));
            yield Prisma_1.default.ticket.createMany({
                data: ticketData,
            });
            res.status(201).json({
                statusCode: 201,
                message: "Booking successful",
                updatedSeat,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    statusCode: 500,
                    message: error.message,
                });
            }
            else {
                res.status(500).json({
                    statusCode: 500,
                    message: "Unexpected error occurred",
                });
            }
        }
    });
}
