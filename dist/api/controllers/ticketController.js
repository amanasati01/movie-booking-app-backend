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
exports.bookTicket = bookTicket;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const Prisma_1 = __importDefault(require("../utils/Prisma"));
const library_1 = require("@prisma/client/runtime/library");
function bookTicket(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const ticketDetails = req.body;
            if (!ticketDetails.movie || !ticketDetails.amount || !ticketDetails.endAt || !ticketDetails.seatType || !ticketDetails.seatNo || !ticketDetails.startAt || !ticketDetails.theater) {
                throw new ApiError_1.default(400, 'Send complete info of tickets');
            }
            const ticket = yield Prisma_1.default.ticket.create({
                data: {
                    movie: ticketDetails.movie,
                    theater: ticketDetails.theater,
                    seatType: ticketDetails.seatType,
                    seatNo: ticketDetails.seatNo,
                    startAt: new Date(ticketDetails.startAt),
                    endAt: new Date(ticketDetails.endAt),
                    amount: ticketDetails.amount,
                    buyerId: Number(id)
                }
            });
            if (!ticket) {
                throw new ApiError_1.default(500, 'Failed to create ticket, please try again.');
            }
            res.status(201).json({
                message: 'Ticket created successfully',
                ticket
            });
        }
        catch (error) {
            if (error instanceof ApiError_1.default) {
                res.status(error.statusCode).json({
                    message: error.message,
                    statuCode: error.statusCode
                });
            }
            else if (error instanceof library_1.PrismaClientInitializationError) {
                res.status(500).json({
                    message: 'Database connection error. Please try again later.',
                    statusCode: 500,
                });
            }
            else if (error instanceof Error) {
                res.status(500).json({
                    message: error.message,
                    statusCode: 500,
                });
            }
            else {
                res.status(500).json({
                    messsage: 'An unexpected error occured',
                    statusCode: 500,
                });
            }
        }
    });
}
