"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const projectController_1 = require("../controllers/projectController");
const authorizeGlobalRole_1 = require("../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Get all projects
router.get('/projects', (0, authorizeGlobalRole_1.authorizeGlobalRole)(client_1.GlobalRole.ADMIN), async (req, res) => {
    await (0, projectController_1.getAllProjects)(req, res, prisma_1.default);
});
// Get project by Id
router.get('/projects/:id', (0, authorizeGlobalRole_1.authorizeGlobalRole)(client_1.GlobalRole.ADMIN), async (req, res) => {
    await (0, projectController_1.getProjectById)(req, res, prisma_1.default);
});
// Create project
router.post('/projects', (0, authorizeGlobalRole_1.authorizeGlobalRole)(client_1.GlobalRole.ADMIN), async (req, res, next) => {
    await (0, projectController_1.createProject)(req, res, next, prisma_1.default);
});
// Update project
router.patch('/projects/:id', (0, authorizeGlobalRole_1.authorizeGlobalRole)(client_1.GlobalRole.ADMIN), async (req, res, next) => {
    await (0, projectController_1.updateProject)(req, res, next, prisma_1.default);
});
// Delete project
router.delete('/projects/:id', (0, authorizeGlobalRole_1.authorizeGlobalRole)(client_1.GlobalRole.ADMIN), async (req, res, next) => {
    await (0, projectController_1.deleteProject)(req, res, next, prisma_1.default);
});
exports.default = router;
