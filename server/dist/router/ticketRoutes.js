"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/tickets', async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany();
        res.status(200).json(tickets);
    }
    catch (error) {
        console.error('Error fetching users: ', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
router.get('/tickets/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const tickets = await prisma.ticket.findUnique({
            where: { id: Number(id) },
        });
        res.status(200).json(tickets);
    }
    catch (error) {
        console.error('Error fetching tickets: ', error);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});
router.post('/tickets', async (req, res) => {
    try {
        const ticketData = req.body;
        const ticket = await prisma.ticket.create({
            data: ticketData,
        });
        res.status(200).json(ticket);
    }
    catch (error) {
        console.error('Error creating ticket: ', error);
        res.status(500).json({ error: 'Failed to create ticket' });
    }
});
router.delete('/tickets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTicket = await prisma.ticket.delete({
            where: { id: Number(id) },
        });
        res.status(200).json(deleteTicket);
    }
    catch (error) {
        console.error('Error fetching tickets: ', error);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});
exports.default = router;
