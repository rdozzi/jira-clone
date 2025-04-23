"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const ticketController_1 = require("../controllers/ticketController");
const router = (0, express_1.Router)();
// Get all Tickets
router.get('/tickets', async (req, res) => {
    await (0, ticketController_1.getAllTickets)(req, res, prisma_1.default);
});
// Get Ticket by Id
router.get('/tickets/:id', async (req, res) => {
    await (0, ticketController_1.getTicketById)(req, res, prisma_1.default);
});
// Get all Tickets by User Id
router.get('/tickets/assigneeId/:userId', async (req, res) => {
    await (0, ticketController_1.getTicketByAssigneeId)(req, res, prisma_1.default);
});
// Create new ticket
router.post('/tickets', async (req, res, next) => {
    await (0, ticketController_1.createNewTicket)(req, res, next, prisma_1.default);
});
// Update a ticket
router.patch('/tickets/updateTicket/:ticketId', async (req, res) => {
    await (0, ticketController_1.updateTicket)(req, res, prisma_1.default);
});
// Delete ticket
router.delete('/tickets/:id', async (req, res) => {
    await (0, ticketController_1.deleteTicket)(req, res, prisma_1.default);
});
exports.default = router;
