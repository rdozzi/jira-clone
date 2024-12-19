"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/projects', async (req, res) => {
    try {
        const projects = await prisma.project.findMany();
        res.status(200).json(projects);
    }
    catch (error) {
        console.error('Error fetching projects: ', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});
router.get('/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const projects = await prisma.project.findUnique({
            where: { id: Number(id) },
        });
        res.status(200).json(projects);
    }
    catch (error) {
        console.error('Error fetching projects: ', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});
router.post('/projects', async (req, res) => {
    try {
        const projectData = req.body;
        const project = await prisma.project.create({
            data: projectData,
        });
        res.status(200).json(project);
    }
    catch (error) {
        console.error('Error creating project: ', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});
router.delete('/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteProject = await prisma.project.delete({
            where: { id: Number(id) },
        });
        res.status(200).json(deleteProject);
    }
    catch (error) {
        console.error('Error fetching project: ', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});
exports.default = router;
