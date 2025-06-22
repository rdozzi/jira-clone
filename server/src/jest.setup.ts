/// <reference types="jest" />
import dotenv from 'dotenv';

dotenv.config({ path: '../server/.env.test' });
jest.setTimeout(10000);
