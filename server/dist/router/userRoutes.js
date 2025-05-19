"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const userController_1 = require("../controllers/userController");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const authenticate_1 = require("../middleware/authenticate");
const authorize_1 = require("../middleware/authorize");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Get all users
router.get('/users/all', async (req, res) => {
    await (0, userController_1.getAllUsers)(req, res, prisma_1.default);
});
// Get user
router.get('/users', async (req, res) => {
    await (0, userController_1.getUser)(req, res, prisma_1.default);
});
// Create user
router.post('/users', authenticate_1.authenticate, (0, authorize_1.authorize)(client_1.GlobalRole.ADMIN), async (req, res, next) => {
    await (0, userController_1.createUser)(req, res, next, prisma_1.default);
});
// Delete user
router.patch('/users/:id/soft-delete', authenticate_1.authenticate, (0, authorize_1.authorize)(client_1.GlobalRole.ADMIN), async (req, res, next) => {
    await (0, userController_1.deleteUser)(req, res, next, prisma_1.default);
});
// Update user info
router.patch('/users/:id/update', async (req, res, next) => {
    await (0, userController_1.updateUser)(req, res, next, prisma_1.default);
});
// Update user avatar
router.patch('/users/:id/avatar', uploadMiddleware_1.uploadSingleMiddleware, async (req, res) => {
    await (0, userController_1.updateUserAvatar)(req, res, prisma_1.default);
});
exports.default = router;
