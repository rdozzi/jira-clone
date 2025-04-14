"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get all comments
router.get('/comments', async (req, res) => {
    try {
        const comments = await prisma.comment.findMany();
        res.status(200).json(comments);
    }
    catch (error) {
        console.error('Error fetching comments: ', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});
// Get comments for a specific ticket
router.get('/comments/:ticketId', async (req, res) => {
    const { ticketId } = req.params;
    try {
        const ticketComments = await prisma.comment.findMany({
            where: { ticketId: Number(ticketId) },
        });
        res.status(200).json(ticketComments);
    }
    catch (error) {
        console.error('Error fetching comments: ', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});
// Create a comment
router.post('/comments', async (req, res) => {
    try {
        const commentData = req.body;
        const comment = await prisma.comment.create({
            data: commentData,
        });
        res.status(200).json(comment);
    }
    catch (error) {
        console.error('Error creating comment: ', error);
        res.status(500).json({ error: 'Failed to create comment' });
    }
});
// Delete comment
router.delete('/comments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteComment = await prisma.comment.delete({
            where: { id: Number(id) },
        });
        res.status(200).json(deleteComment);
    }
    catch (error) {
        console.error('Error fetching tickets: ', error);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});
// Update comment
router.patch('/comments/:commentId', async (req, res) => {
    try {
        const { content } = req.body;
        const { commentId } = req.params;
        console.log(commentId);
        if (typeof content !== 'string' || content.trim() === '') {
            res.status(400).json({
                error: 'Content is required and must be a non-empty string.',
            });
            return;
        }
        const updateComment = await prisma.comment.update({
            where: { id: Number(commentId) },
            data: {
                content,
            },
        });
        res.status(200).json(updateComment);
    }
    catch (error) {
        console.error('Error editing comment: ', error);
        res.status(500).json({ error: 'Failed to edit comment' });
    }
});
exports.default = router;
