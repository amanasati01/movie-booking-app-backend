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
exports.seatBook = seatBook;
exports.seatBlock = seatBlock;
exports.seatAvailable = seatAvailable;
const Prisma_1 = __importDefault(require("./Prisma"));
var SeatStatus;
(function (SeatStatus) {
    SeatStatus["AVAILABLE"] = "AVAILABLE";
    SeatStatus["BLOCKED"] = "BLOCKED";
    SeatStatus["BOOKED"] = "BOOKED";
    SeatStatus["SELECTED"] = "SELECTED";
})(SeatStatus || (SeatStatus = {}));
function updateSeatStatus(seatIds, newStatus) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedSeats = yield Prisma_1.default.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
            const updatedResults = [];
            for (const id of seatIds) {
                const seat = yield prisma.seat.findUnique({ where: { id } });
                if (!seat) {
                    throw new Error(`Seat with id ${id} not found.`);
                }
                const updatedSeat = yield prisma.seat.update({
                    where: { id },
                    data: { status: newStatus },
                });
                updatedResults.push(updatedSeat);
            }
            return updatedResults;
        }));
        return updatedSeats;
    });
}
function seatBook(seatId) {
    return __awaiter(this, void 0, void 0, function* () {
        return updateSeatStatus(seatId, SeatStatus.BOOKED);
    });
}
function seatBlock(seatId) {
    return __awaiter(this, void 0, void 0, function* () {
        return updateSeatStatus(seatId, SeatStatus.BOOKED);
    });
}
function seatAvailable(seatId) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedSeats = yield Prisma_1.default.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
            let updatedResults;
            const seat = yield prisma.seat.findUnique({ where: { id: seatId } });
            if (!seat) {
                throw new Error(`Seat with id ${seatId} not found.`);
            }
            if (seat.status === "AVAILABLE") {
                console.log("Error occured");
                throw new Error(`Seat with id ${seatId} is already ${SeatStatus.AVAILABLE}.`);
            }
            const updatedSeat = yield prisma.seat.update({
                where: { id: seatId },
                data: { status: SeatStatus.AVAILABLE },
            });
            updatedResults = updatedSeat;
            return updatedResults;
        }));
    });
}
// export async function seatSelected(seatId: number[]) {
//     return updateSeatStatus(seatId, SeatStatus.SELECTED);
// }
