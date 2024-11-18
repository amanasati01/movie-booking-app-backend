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
exports.default = generateSeats;
const Prisma_1 = __importDefault(require("./Prisma"));
function generateSeats(theaterId, showtimeId) {
    return __awaiter(this, void 0, void 0, function* () {
        //BoxA
        const boxA = [];
        const seat = yield Prisma_1.default.seat.findFirst({
            where: {
                showtimeId,
                theaterId
            }
        });
        if (!seat) {
            for (let col = 1; col <= 12; col++) {
                boxA.push({
                    number: String(col),
                    theaterId,
                    seatType: 'boxA',
                    showtimeId
                });
            }
            yield Prisma_1.default.seat.createMany({
                data: boxA
            });
            //BoxF
            const boxF = [];
            for (let col = 1; col <= 18; col++) {
                boxF.push({
                    number: String(col),
                    theaterId,
                    seatType: 'boxF',
                    showtimeId
                });
            }
            yield Prisma_1.default.seat.createMany({
                data: boxF
            });
            //Balcony Gold
            const gold = [];
            for (let row = 1; row <= 5; row++) {
                const rowLabel = String.fromCharCode(64 + row);
                for (let seat = 1; seat <= 15; seat++) {
                    gold.push({
                        number: `${rowLabel}${seat}`,
                        theaterId: theaterId,
                        showtimeId,
                        seatType: 'gold'
                    });
                }
            }
            yield Prisma_1.default.seat.createMany({
                data: gold
            });
            //Deluxe
            // const deluxe :seatType[] =[]
            // for (let row = 1; row <= 5; row++) {
            //     const rowLabel = String.fromCharCode(64 + row); 
            //     for (let seat = 1; seat <= 15; seat++) {
            //         deluxe.push({
            //         number: `${rowLabel}${seat}`,  
            //         theaterId: theaterId,
            //         showtimeId,
            //         seatType : 'gold'
            //       });
            //     }
            // }
            // await prisma.seat.createMany({
            //     data:deluxe
            // })}
        }
        else {
            return;
        }
    });
}
