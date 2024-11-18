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
exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client"); // Import Prisma for error handling
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const HashPassword_1 = __importDefault(require("../utils/HashPassword"));
const Prisma_1 = __importDefault(require("../utils/Prisma"));
const Auth_1 = require("../utils/Auth");
const bcrypt_1 = __importDefault(require("bcrypt"));
const library_1 = require("@prisma/client/runtime/library");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDetail = req.body;
        if (!userDetail.email || !userDetail.name || !userDetail.password) {
            throw new ApiError_1.default(400, 'All fields are required');
        }
        console.log("Got the user req body");
        const hashedPassword = yield (0, HashPassword_1.default)(userDetail.password);
        console.log("Hashed the password ", hashedPassword);
        const user = yield Prisma_1.default.user.create({
            data: {
                name: userDetail.name,
                email: userDetail.email,
                password: hashedPassword
            },
            select: {
                name: true,
                email: true
            }
        });
        if (!user) {
            throw new ApiError_1.default(500, "Database failed to save user details");
        }
        console.log("Create the user in db ", user);
        const obj = {
            email: userDetail.email,
        };
        const token = (0, Auth_1.setUser)(obj);
        res.cookie("bearer", token, {
            httpOnly: false,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ message: "User registered successfully", user });
    }
    catch (error) {
        if (error instanceof ApiError_1.default) {
            res.status(error.statusCode).json({
                message: error.message,
                statusCode: error.statusCode,
            });
        }
        else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            res.status(500).json({
                message: "A database error occurred. Please try again later.",
                statusCode: 500,
            });
        }
        else if (error instanceof Error) {
            console.error("Error during user registration:", error);
            res.status(500).json({
                message: error.message || "Internal Server Error",
                statusCode: 500,
            });
        }
        else {
            res.status(500).json({
                message: "An unexpected error occurred. Please try again later.",
                statusCode: 500,
            });
        }
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDetail = req.body;
        if (!userDetail.email || !userDetail.password) {
            throw new ApiError_1.default(400, 'All fields are required');
        }
        const user = yield Prisma_1.default.user.findUnique({
            where: {
                email: userDetail.email
            },
            select: {
                email: true,
                id: true,
                password: true
            }
        });
        if (!user) {
            throw new ApiError_1.default(401, "Invalid credentials, please try again.");
        }
        const isPassword = yield bcrypt_1.default.compare(userDetail.password, user.password);
        if (!isPassword) {
            throw new ApiError_1.default(401, "Invalid credentials, please try again.");
        }
        else {
            const obj = {
                'email': userDetail.email
            };
            const token = (0, Auth_1.setUser)(obj);
            res.cookie("bearer", token, {
                httpOnly: false,
                secure: false,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({
                message: "User login successfully",
                data: {
                    id: user.id,
                    email: user.email
                }
            });
        }
    }
    catch (error) {
        if (error instanceof ApiError_1.default) {
            res.status(error.statusCode).json({
                message: error.message,
                statusCode: error.statusCode
            });
        }
        else if (error instanceof library_1.PrismaClientInitializationError) {
            res.status(500).json({
                message: "Database error occured please try again.",
                statusCode: 500
            });
        }
        else if (error instanceof Error) {
            res.status(500).json({
                message: error.message || "Internet server error.",
                statusCode: 500
            });
        }
        else {
            res.status(500).json({
                message: "An unexpected error occurred. Please try again later.",
                statusCode: 500,
            });
        }
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => {
    try {
        res.cookie('bearer', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/'
        });
    }
    catch (error) {
        throw new ApiError_1.default(500, "Logout failed");
    }
};
exports.logoutUser = logoutUser;
