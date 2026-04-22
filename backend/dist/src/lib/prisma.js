"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = __importDefault(require("@prisma/client"));
const adapter_pg_1 = require("@prisma/adapter-pg");
const PrismaClient = client_1.default.PrismaClient ?? client_1.default.default ?? client_1.default;
function createPrismaClient() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error('DATABASE_URL is missing. Add it to your .env file.');
    }
    const baseOptions = {
        log: process.env.NODE_ENV === 'development'
            // In development: log all queries so we can debug
            ? ['query', 'error', 'warn']
            // In production: only log errors
            : ['error'],
        errorFormat: process.env.NODE_ENV === 'development'
            ? 'pretty' // colored, easy to read errors
            : 'minimal', // short errors for production logs
    };
    if (databaseUrl.startsWith('prisma://') ||
        databaseUrl.startsWith('prisma+postgres://')) {
        return new PrismaClient({
            ...baseOptions,
            accelerateUrl: databaseUrl,
        });
    }
    const adapter = new adapter_pg_1.PrismaPg({ connectionString: databaseUrl });
    return new PrismaClient({
        ...baseOptions,
        adapter,
    });
}
// Use existing client if it exists (hot reload protection)
// Create new client if it does not exist yet
const prisma = global.__prisma ?? createPrismaClient();
// Save to global in development only
if (process.env.NODE_ENV !== 'production') {
    global.__prisma = prisma;
}
exports.default = prisma;
