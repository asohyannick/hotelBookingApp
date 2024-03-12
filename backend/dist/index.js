"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const app = (0, express_1.default)();
const PORT = parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '8000') || 8000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.get('/', (req, res, next) => {
    res.send("API is working...");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
