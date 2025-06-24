import { describe, expect, afterAll, beforeAll, it } from '@jest/globals';
import request from 'supertest';

import { User } from '@prisma/client';
import { app } from '../src/app';
import { prismaTest } from '../src/lib/prismaTestClient';
import { createGlobalAdmin } from '../src/utilities/testUtilities/createUserProfile';
import { resetTestDatabase } from '../src/utilities/testUtilities/resetTestDatabase';

// Create a user: Global.User
// Create a project: Project1
// Create a Board: Board1
// Create a Ticket: Ticket1
// Create 2 Logs associated with Ticket1
// Create a projectMember entry that associates user with project1 as a Project.Viewer
// Create an auth token
