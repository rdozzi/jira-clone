import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const saltRounds = 10; // For bcrypt password hashing

async function main() {}
