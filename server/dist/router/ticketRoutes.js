"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get all Tickets
router.get('/tickets', async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany({
            relationLoadStrategy: 'query',
            include: {
                assignee: {
                    select: {
                        first_name: true,
                        last_name: true,
                    },
                },
            },
        });
        res.status(200).json(tickets);
    }
    catch (error) {
        console.error('Error fetching tickets: ', error);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});
// Get all Tickets by Id
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
// Get all Tickets by User Id
router.get('/tickets/assigneeId/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    try {
        const tickets = await prisma.ticket.findMany({
            where: { assigneeId: Number(userId) },
        });
        res.status(200).json(tickets);
    }
    catch (error) {
        console.log('Error fetching tickets: ', error);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});
// Create new ticket
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
// Update a ticket
router.patch('/tickets/updateTicket/:assigneeId/:ticketId', async (req, res) => {
    try {
        const ticketData = req.body;
        const { assigneeId, ticketId } = req.params;
        const ticket = await prisma.ticket.update({
            where: { assigneeId: Number(assigneeId), id: Number(ticketId) },
            data: {
                ...ticketData,
            },
        });
        res.status(200).json(ticket);
    }
    catch (error) {
        console.error('Error editing ticket: ', error);
        res.status(500).json({ error: 'Failed to edit ticket' });
    }
});
// Delete ticket
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
