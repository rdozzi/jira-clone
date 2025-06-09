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
const ticketController_1 = require("../controllers/ticketController");
const checkTicketOwnership_1 = require("../middleware/checkTicketOwnership");
const router = (0, express_1.Router)();
// Get all Tickets
router.get('/tickets', (0, authorizeGlobalRole_1.authorizeGlobalRole)(client_1.GlobalRole.ADMIN), async (req, res) => {
    await (0, ticketController_1.getAllTickets)(req, res, prisma_1.default);
});
// Get Ticket by Id
router.get('/tickets/:id', (req, res, next) => (0, checkProjectMembership_1.checkProjectMembership)(req, res, next), (0, checkProjectRole_1.checkProjectRole)(client_1.ProjectRole.ADMIN), async (req, res) => {
    await (0, ticketController_1.getTicketById)(req, res, prisma_1.default);
});
// Get all Tickets by User Id
router.get('/tickets/assigneeId/:userId', (req, res, next) => (0, checkProjectMembership_1.checkProjectMembership)(req, res, next), (0, checkProjectRole_1.checkProjectRole)(client_1.ProjectRole.USER), async (req, res) => {
    await (0, ticketController_1.getTicketByAssigneeId)(req, res, prisma_1.default);
});
// Get Tickets by Board Id
router.get('/tickets/:boardId/board', (req, res, next) => (0, checkProjectMembership_1.checkProjectMembership)(req, res, next), (0, checkProjectRole_1.checkProjectRole)(client_1.ProjectRole.VIEWER), async (req, res) => {
    await (0, ticketController_1.getTicketsByBoardId)(req, res, prisma_1.default);
});
// Create new ticket
router.post('/tickets', (req, res, next) => (0, checkProjectMembership_1.checkProjectMembership)(req, res, next), (0, checkProjectRole_1.checkProjectRole)(client_1.ProjectRole.USER), async (req, res, next) => {
    await (0, ticketController_1.createNewTicket)(req, res, next, prisma_1.default);
});
// Delete ticket
router.delete('/tickets/:id', (req, res, next) => (0, checkProjectMembership_1.checkProjectMembership)(req, res, next), (0, checkProjectRole_1.checkProjectRole)(client_1.ProjectRole.USER), (0, checkTicketOwnership_1.checkTicketOwnership)(prisma_1.default), async (req, res, next) => {
    await (0, ticketController_1.deleteTicket)(req, res, next, prisma_1.default);
});
// Update a ticket
router.patch('/tickets/updateTicket/:id', (req, res, next) => (0, checkProjectMembership_1.checkProjectMembership)(req, res, next), (0, checkProjectRole_1.checkProjectRole)(client_1.ProjectRole.USER), (0, checkTicketOwnership_1.checkTicketOwnership)(prisma_1.default), async (req, res, next) => {
    await (0, ticketController_1.updateTicket)(req, res, next, prisma_1.default);
});
exports.default = router;
