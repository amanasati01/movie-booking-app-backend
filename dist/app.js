"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("./api/routes/userRoutes"));
const ticketRoutes_1 = __importDefault(require("./api/routes/ticketRoutes"));
require('dotenv').config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json({ limit: '16kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '16kb' }));
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    console.log("Request received:", req.method, req.url);
    next();
});
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/tickets', ticketRoutes_1.default);
app.use((req, res, next) => {
    console.log("Reached end of middleware chain");
    res.status(404).send("Not Found");
});
exports.default = app;
