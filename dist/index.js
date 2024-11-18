"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
app_1.default.on('error', (err) => {
    console.log(err);
});
app_1.default.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});