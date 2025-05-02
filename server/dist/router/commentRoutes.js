"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const commentController_1 = require("../controllers/commentController");
const router = (0, express_1.Router)();
// Get all comments
router.get('/comments', async (req, res) => {
    await (0, commentController_1.getAllComments)(req, res, prisma_1.default);
});
// Get comments for a specific ticket
router.get('/comments/:ticketId', async (req, res) => {
    await (0, commentController_1.getAllCommentsById)(req, res, prisma_1.default);
});
// Create a comment
router.post('/comments', async (req, res, next) => {
    await (0, commentController_1.createComment)(req, res, next, prisma_1.default);
});
// Delete comment
router.delete('/comments/:id', async (req, res, next) => {
    await (0, commentController_1.deleteComment)(req, res, next, prisma_1.default);
});
// Update comment
router.patch('/comments/:commentId', async (req, res, next) => {
    await (0, commentController_1.updateComment)(req, res, next, prisma_1.default);
});
exports.default = router;
