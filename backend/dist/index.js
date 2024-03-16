"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import connectedDB from '../config/db.config';
const mongoose_1 = __importDefault(require("mongoose"));
// routes
const users_route_1 = __importDefault(require("../src/routes/users.route"));
const auth_route_1 = __importDefault(require("../src/routes/auth.route"));
mongoose_1.default.connect(process.env.MONGODB_URI_CONNNECTIONSTRING).then(() => {
    console.log('Connected to database:', process.env.MONGODB_URI_CONNNECTIONSTRING);
});
const app = (0, express_1.default)();
const PORT = parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '8000') || 8000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/dist")));
// routes
app.use('/api/users', users_route_1.default);
app.use('/api/auth', auth_route_1.default);
app.get('/', (req, res, next) => {
    res.send("API is working...");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
