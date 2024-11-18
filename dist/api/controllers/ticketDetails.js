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
exports.default = ticketDetails;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const Prisma_1 = __importDefault(require("../utils/Prisma"));
function ticketDetails(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.query;
            const userId = Number(id);
            if (!userId) {
                throw new ApiError_1.default(400, "Id is required");
            }
            const response = yield Prisma_1.default.ticket.findMany({
                where: {
                    buyerId: userId
                },
            });
            res.status(200).json({
                message: "Success",
                response
            });
        }
        catch (error) {
            if (error instanceof ApiError_1.default) {
                res.status(error.statusCode).json({
                    message: "Failed",
                    error: error.message
                });
            }
            else if (error instanceof Error) {
                res.status(500).json({
                    message: "Failed",
                    error: error.message
                });
            }
            else {
                res.status(500).json({
                    message: "Failed",
                    error: "Internal server error"
                });
            }
        }
    });
}
