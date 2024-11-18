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
const GenerateSeats_1 = __importDefault(require("./GenerateSeats"));
const Prisma_1 = __importDefault(require("./Prisma"));
const createTheater = (name, location, showtime, movieName) => __awaiter(void 0, void 0, void 0, function* () {
    let theater = yield Prisma_1.default.theater.findUnique({
        where: {
            name: name,
        },
    });
    if (!theater) {
        theater = yield Prisma_1.default.theater.create({
            data: {
                name: name,
                location: location,
            },
        });
    }
    let movie = yield Prisma_1.default.movie.findUnique({
        where: {
            title: movieName,
        },
    });
    if (!movie) {
        movie = yield Prisma_1.default.movie.create({
            data: {
                title: movieName,
                duration: 3,
            },
        });
    }
    let show = yield Prisma_1.default.showtime.findFirst({
        where: {
            time: showtime,
            movieId: movie.id,
        },
    });
    if (!show) {
        show = yield Prisma_1.default.showtime.create({
            data: {
                time: showtime,
                movieId: movie.id,
            },
        });
    }
    if (theater && show) {
        yield (0, GenerateSeats_1.default)(theater.id, show.id);
    }
    return theater;
});
exports.default = createTheater;
