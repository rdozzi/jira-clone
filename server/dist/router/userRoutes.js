"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const client_1 = require("@prisma/client");
const authorizeGlobalRole_1 = require("../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole");
const checkProjectMembership_1 = require("../middleware/checkProjectMembership");
const checkProjectRole_1 = require("../middleware/checkProjectRole");
const authorizeSelfOrAdmin_1 = require("../middleware/authAndLoadInfoMiddleware/authorizeSelfOrAdmin");
const userController_1 = require("../controllers/userController");
const uploadMiddleware_1 = require("../middleware/attachments/uploadMiddleware");
const router = (0, express_1.Router)();
// Get all users
router.get('/users/all', (0, authorizeGlobalRole_1.authorizeGlobalRole)(client_1.GlobalRole.USER), async (req, res) => {
    await (0, userController_1.getAllUsers)(req, res, prisma_1.default);
});
// Get user
router.get('/users', (0, authorizeGlobalRole_1.authorizeGlobalRole)(client_1.GlobalRole.ADMIN), async (req, res) => {
    await (0, userController_1.getUser)(req, res, prisma_1.default);
});
// Get user by project
router.get('/users/:id/project', (req, res, next) => (0, checkProjectMembership_1.checkProjectMembership)(req, res, next), (0, checkProjectRole_1.checkProjectRole)(client_1.ProjectRole.VIEWER), async (req, res) => {
    await (0, userController_1.getUserByProjectId)(req, res, prisma_1.default);
});
// Create user
router.post('/users', (0, authorizeGlobalRole_1.authorizeGlobalRole)(client_1.GlobalRole.ADMIN), async (req, res, next) => {
    await (0, userController_1.createUser)(req, res, next, prisma_1.default);
});
// Delete user
router.patch('/users/:id/soft-delete', (0, authorizeGlobalRole_1.authorizeGlobalRole)(client_1.GlobalRole.ADMIN), async (req, res, next) => {
    await (0, userController_1.deleteUser)(req, res, next, prisma_1.default);
});
// Update user info
router.patch('/users/:id/update', authorizeSelfOrAdmin_1.authorizeSelfOrAdmin, async (req, res, next) => {
    await (0, userController_1.updateUser)(req, res, next, prisma_1.default);
});
// Update user avatar
router.patch('/users/:id/avatar', authorizeSelfOrAdmin_1.authorizeSelfOrAdmin, uploadMiddleware_1.uploadSingleMiddleware, async (req, res) => {
    await (0, userController_1.updateUserAvatar)(req, res, prisma_1.default);
});
exports.default = router;
