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
exports.default = theaterGenerations;
const CreateTheater_1 = __importDefault(require("../utils/CreateTheater"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
function theaterGenerations(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const theaterDetails = req.body;
            console.log(theaterDetails);
            if (!theaterDetails.location || !theaterDetails.movieName || !theaterDetails.name || !theaterDetails.showTime) {
                throw new ApiError_1.default(400, 'Send complete info of theater');
            }
            const theater = yield (0, CreateTheater_1.default)(theaterDetails.name, theaterDetails.location, theaterDetails.showTime, theaterDetails.movieName);
            res.status(201).json({ theater,
                "statusCode": 201
            });
        }
        catch (error) {
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
                    messsage: 'An unexpected error occured',
                    statusCode: 500,
                });
            }
        }
    });
}
