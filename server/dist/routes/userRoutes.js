"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error fetching users: ', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
router.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const users = await prisma.user.findUnique({ where: { id: Number(id) } });
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error fetching users: ', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
exports.default = router;
