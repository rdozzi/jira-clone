"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const resolveProjectIdFromProject_1 = require("../middleware/projectMiddleware/resolveProjectIdFromProject");
const prisma_1 = __importDefault(require("../lib/prisma"));
const projectController_1 = require("../controllers/projectController");
// Middleware
const authorizeGlobalRole_1 = require("../middleware/authAndLoadInfoMiddleware/authorizeGlobalRole");
const checkIfGlobalSuperAdmin_1 = require("../middleware/checkIfGlobalSuperAdmin");
const checkProjectMembership_1 = require("../middleware/checkProjectMembership");
const checkProjectRole_1 = require("../middleware/checkProjectRole");
const router = (0, express_1.Router)();
// Get all projects
router.get('/projects', (0, authorizeGlobalRole_1.authorizeGlobalRole)(client_1.GlobalRole.ADMIN), async (req, res) => {
    await (0, projectController_1.getAllProjects)(req, res, prisma_1.default);
});
// Get project by Id
router.get('/projects/:projectId', checkIfGlobalSuperAdmin_1.checkIfGlobalSuperAdmin, (0, resolveProjectIdFromProject_1.resolveProjectIdFromProject)(), (0, checkProjectMembership_1.checkProjectMembership)({ allowGlobalSuperAdmin: true }), (0, checkProjectRole_1.checkProjectRole)(client_1.ProjectRole.VIEWER, { allowGlobalSuperAdmin: true }), async (req, res) => {
    await (0, projectController_1.getProjectById)(req, res, prisma_1.default);
});
// Create project (Become a member of project)
router.post('/projects', (0, authorizeGlobalRole_1.authorizeGlobalRole)(client_1.GlobalRole.ADMIN), async (req, res, next) => {
    await (0, projectController_1.createProject)(req, res, next, prisma_1.default);
});
// Update project
router.patch('/projects/:projectId', checkIfGlobalSuperAdmin_1.checkIfGlobalSuperAdmin, (0, resolveProjectIdFromProject_1.resolveProjectIdFromProject)(), (0, checkProjectMembership_1.checkProjectMembership)({ allowGlobalSuperAdmin: true }), (0, checkProjectRole_1.checkProjectRole)(client_1.ProjectRole.ADMIN, { allowGlobalSuperAdmin: true }), async (req, res, next) => {
    await (0, projectController_1.updateProject)(req, res, next, prisma_1.default);
});
// Delete project
router.delete('/projects/:projectId', checkIfGlobalSuperAdmin_1.checkIfGlobalSuperAdmin, (0, resolveProjectIdFromProject_1.resolveProjectIdFromProject)(), (0, checkProjectMembership_1.checkProjectMembership)({ allowGlobalSuperAdmin: true }), (0, checkProjectRole_1.checkProjectRole)(client_1.ProjectRole.ADMIN, { allowGlobalSuperAdmin: true }), async (req, res, next) => {
    await (0, projectController_1.deleteProject)(req, res, next, prisma_1.default);
});
exports.default = router;
