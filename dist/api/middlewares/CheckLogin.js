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
exports.default = CheckLogin;
const Auth_1 = require("../utils/Auth");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const Prisma_1 = __importDefault(require("../utils/Prisma"));
function CheckLogin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.bearer) || ((_b = req.header('Authorization')) === null || _b === void 0 ? void 0 : _b.replace("bearer ", ""));
            if (!token) {
                throw new ApiError_1.default(401, "Unauthorized request");
            }
            const decodedToken = (0, Auth_1.getUser)(token);
            if (decodedToken) {
                const user = yield Prisma_1.default.user.findUnique({
                    where: {
                        email: decodedToken.email
                    },
                    select: {
                        email: true,
                        name: true
                    }
                });
                if (!user) {
                    throw new ApiError_1.default(401, "Unauthorized: User not found or invalid credentials");
                }
                req.user = user;
                next();
            }
        }
        catch (error) {
            if (error instanceof ApiError_1.default) {
                res.status(error.statusCode).json({
                    message: error.message,
                    status: error.statusCode
                });
            }
            else if (error instanceof Error) {
                res.status(500).json({
                    message: error.message,
                    status: 500
                });
            }
            else {
                res.status(500).json({
                    message: "Unexpected error occured. please try again later",
                    status: 500
                });
            }
        }
    });
}
