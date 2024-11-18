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
exports.default = seatData;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const Prisma_1 = __importDefault(require("../utils/Prisma"));
function seatData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clientLastUpdate = new Date(typeof req.query.lastUpdated === 'string' || typeof req.query.lastUpdated === 'number' ? req.query.lastUpdated : 0);
            console.log(" clientLastUpdate ", clientLastUpdate);
            const theater = req.body;
            console.log(theater.movieName);
            if (!theater.id || !theater.movieName || !theater.showTime) {
                throw new ApiError_1.default(400, "Please send all required theater details.");
            }
            const movie = yield Prisma_1.default.movie.findUnique({
                where: { title: theater.movieName }
            });
            if (!movie) {
                throw new ApiError_1.default(404, "Movie not found");
            }
            const show = yield Prisma_1.default.showtime.findFirst({
                where: { movieId: movie.id, time: theater.showTime }
            });
            if (!show) {
                throw new ApiError_1.default(404, "Showtime not found");
            }
            const lastUpdated = yield getLatestUpdateTime(theater.id, show.id);
            const checkForUpdates = () => __awaiter(this, void 0, void 0, function* () {
                const latestUpdateTime = yield getLatestUpdateTime(theater.id, show.id);
                console.log("cheking for updates");
                if (latestUpdateTime && latestUpdateTime > clientLastUpdate) {
                    console.log("I am in if case");
                    const seats = yield Prisma_1.default.seat.findMany({
                        where: {
                            theaterId: theater.id,
                            showtimeId: show.id
                        },
                        orderBy: { id: 'asc' }
                    });
                    if (!seats.length) {
                        throw new ApiError_1.default(404, "Seats not found.");
                    }
                    res.status(200).json({ data: seats, lastUpdated: latestUpdateTime });
                    console.log("i have send a response");
                }
                else {
                    console.log("I am in else case set a time out of 1 sec");
                    setTimeout(checkForUpdates, 1000);
                    console.log("done with timeOut");
                }
            });
            const timeout = setTimeout(() => {
                console.log(" I am in 25 sec timer");
                res.status(204).end();
            }, 25000);
            checkForUpdates();
            console.log(" done with seatData function");
            res.on("finish", () => clearTimeout(timeout));
        }
        catch (error) {
            handleError(res, error);
        }
    });
}
function getLatestUpdateTime(theaterId, showtimeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield Prisma_1.default.seat.findFirst({
            where: { theaterId, showtimeId },
            select: { updatedAt: true },
            orderBy: { updatedAt: 'desc' }
        });
        return result ? result.updatedAt : null;
    });
}
function handleError(res, error) {
    if (error instanceof ApiError_1.default) {
        res.status(error.statusCode).json({
            message: error.message,
            statusCode: error.statusCode
        });
    }
    else if (error instanceof Error) {
        res.status(500).json({
            message: error.message,
            statusCode: 500
        });
    }
    else {
        res.status(500).json({
            message: "Unknown error occurred",
            statusCode: 500
        });
    }
}
