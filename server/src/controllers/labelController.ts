import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

//Get all labels
export async function getAllLabels(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const labels = await prisma.label.findMany();
    res.status(200).json(labels);
  } catch (error) {
    console.error('Error fetching labels: ', error);
    res.status(500).json({ error: 'Failed to fetch labels' });
  }
}

//Create a label
export async function createNewLabel(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const labelData = req.body;
    const label = await prisma.label.create({
      data: labelData,
    });
    res.status(200).json(label);
  } catch (error) {
    console.error('Error creating label: ', error);
    res.status(500).json({ error: 'Failed to create label' });
  }
}

//Update a label
export async function updateLabel(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const labelData = req.body;
    const { labelId } = req.params;
    console.log(labelId);
    const label = await prisma.label.update({
      where: { id: Number(labelId) },
      data: {
        ...labelData,
      },
    });
    res.status(200).json(label);
  } catch (error) {
    console.error('Error editing label: ', error);
    res.status(500).json({ error: 'Failed to edit label' });
  }
}

//Delete a label
export async function deleteLabel(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  try {
    const { labelId } = req.params;
    console.log(labelId);
    const deleteLabel = await prisma.label.delete({
      where: { id: Number(labelId) },
    });
    res.status(200).json(deleteLabel);
  } catch (error) {
    console.error('Error delete label: ', error);
    res.status(500).json({ error: 'Failed to delete label' });
  }
}
