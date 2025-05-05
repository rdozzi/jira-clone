"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./router/userRoutes"));
const projectRoutes_1 = __importDefault(require("./router/projectRoutes"));
const ticketRoutes_1 = __importDefault(require("./router/ticketRoutes"));
const commentRoutes_1 = __importDefault(require("./router/commentRoutes"));
const attachmentRoutes_1 = __importDefault(require("./router/attachmentRoutes"));
const boardRoutes_1 = __importDefault(require("./router/boardRoutes"));
const labelRoutes_1 = __importDefault(require("./router/labelRoutes"));
const authRoutes_1 = __importDefault(require("./router/authRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const logMiddleware_1 = require("./middleware/logMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello! This is your first app with Express.js, Typescript, and Nodemon!');
});
app.use((0, logMiddleware_1.globalLogMiddleware)());
app.use('/api', userRoutes_1.default);
app.use('/api', projectRoutes_1.default);
app.use('/api', ticketRoutes_1.default);
app.use('/api', commentRoutes_1.default);
app.use('/api', attachmentRoutes_1.default);
app.use('/api', boardRoutes_1.default);
app.use('/api', labelRoutes_1.default);
app.use('/api', authRoutes_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server is Running on port ${process.env.PORT} with Nodemon!`);
});
