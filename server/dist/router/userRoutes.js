"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
// Get all users
router.get('/users', async (req, res) => {
    await (0, userController_1.getAllUsers)(req, res, prisma_1.default);
});
// Get user by Id
router.get('/users/:id', async (req, res) => {
    await (0, userController_1.getUserById)(req, res, prisma_1.default);
});
// Create user
router.post('/', async (req, res) => {
    await (0, userController_1.createUser)(req, res, prisma_1.default);
});
router.delete('/users/:id', async (req, res) => {
    await (0, userController_1.deleteUser)(req, res, prisma_1.default);
});
exports.default = router;
