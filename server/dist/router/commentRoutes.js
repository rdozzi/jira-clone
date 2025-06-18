"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authorizeGlobalRole_1 = require("../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole");
const checkProjectMembership_1 = require("../middleware/checkProjectMembership");
const checkProjectRole_1 = require("../middleware/checkProjectRole");
const checkCommentOwnership_1 = require("../middleware/commentMiddleware/checkCommentOwnership");
const prisma_1 = __importDefault(require("../lib/prisma"));
const commentController_1 = require("../controllers/commentController");
const resolveProjectIdFromComment_1 = require("../middleware/commentMiddleware/resolveProjectIdFromComment");
const router = (0, express_1.Router)();
// Get all comments
router.get('/comments', (0, authorizeGlobalRole_1.authorizeGlobalRole)(client_1.GlobalRole.ADMIN), async (req, res) => {
    await (0, commentController_1.getAllComments)(req, res, prisma_1.default);
});
// Get comments for a specific ticket
router.get('/comments/:ticketId', (0, resolveProjectIdFromComment_1.resolveProjectIdFromComment)(), (0, checkProjectMembership_1.checkProjectMembership)({ allowGlobalSuperAdmin: true }), (0, checkProjectRole_1.checkProjectRole)(client_1.ProjectRole.VIEWER, { allowGlobalSuperAdmin: true }), async (req, res) => {
    await (0, commentController_1.getAllCommentsById)(req, res, prisma_1.default);
});
// Create a comment
router.post('/comments', (0, resolveProjectIdFromComment_1.resolveProjectIdFromComment)(), (0, checkProjectMembership_1.checkProjectMembership)(), (0, checkProjectRole_1.checkProjectRole)(client_1.ProjectRole.USER), async (req, res) => {
    await (0, commentController_1.createComment)(req, res, prisma_1.default);
});
// Delete comment
router.delete('/comments/:commentId', (0, resolveProjectIdFromComment_1.resolveProjectIdFromComment)(), (0, checkProjectMembership_1.checkProjectMembership)({ allowGlobalSuperAdmin: true }), (0, checkProjectRole_1.checkProjectRole)(client_1.ProjectRole.USER, { allowGlobalSuperAdmin: true }), (0, checkCommentOwnership_1.checkCommentOwnership)({ allowGlobalSuperAdmin: true }), async (req, res) => {
    await (0, commentController_1.deleteComment)(req, res, prisma_1.default);
});
// Update comment
router.patch('/comments/:commentId', (0, resolveProjectIdFromComment_1.resolveProjectIdFromComment)(), (0, checkProjectMembership_1.checkProjectMembership)({ allowGlobalSuperAdmin: true }), (0, checkProjectRole_1.checkProjectRole)(client_1.ProjectRole.USER, { allowGlobalSuperAdmin: true }), (0, checkCommentOwnership_1.checkCommentOwnership)({ allowGlobalSuperAdmin: true }), async (req, res) => {
    await (0, commentController_1.updateComment)(req, res, prisma_1.default);
});
exports.default = router;
