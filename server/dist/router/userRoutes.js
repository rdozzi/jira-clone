"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const password_1 = require("../password");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get all users
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
// Get user by Id
router.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({ where: { id: Number(id) } });
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error fetching users: ', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
// Create user
router.post('/', async (req, res) => {
    try {
        // const userDetails = await req.body;
        const { email, name, passwordHash, role } = req.body;
        const hashedPassword = await (0, password_1.hashPassword)(passwordHash);
        const user = await prisma.user.create({
            data: {
                email: email,
                name: name,
                passwordHash: hashedPassword,
                role: role,
            },
        });
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error creating user: ', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteData = await prisma.user.delete({
            where: { id: Number(id) },
        });
        res.status(200).json(deleteData);
    }
    catch (error) {
        console.error('Error fetching users: ', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
exports.default = router;
