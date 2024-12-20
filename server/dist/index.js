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
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello! This is your first app with Express.js, Typescript, and Nodemon!');
});
// get all users
app.use('/api', userRoutes_1.default);
// get all projects
app.use('/api', projectRoutes_1.default);
// get all tickets
app.use('/api', ticketRoutes_1.default);
// Fetch comments for a specific ticket
app.use('/api', commentRoutes_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server is Running on port ${process.env.PORT} with Nodemon!`);
});
