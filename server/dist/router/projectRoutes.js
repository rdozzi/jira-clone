"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const projectController_1 = require("../controllers/projectController");
const router = (0, express_1.Router)();
// Get all projects
router.get('/projects', async (req, res) => {
    await (0, projectController_1.getAllProjects)(req, res, prisma_1.default);
});
// Get project by Id
router.get('/projects/:id', async (req, res) => {
    await (0, projectController_1.getProjectById)(req, res, prisma_1.default);
});
// Create project
router.post('/projects', async (req, res) => {
    await (0, projectController_1.createProject)(req, res, prisma_1.default);
});
// Delete project
router.delete('/projects/:id', async (req, res) => {
    await (0, projectController_1.deleteProject)(req, res, prisma_1.default);
});
exports.default = router;
