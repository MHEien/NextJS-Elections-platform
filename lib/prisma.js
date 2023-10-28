"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn'],
});
if (process.env.NODE_ENV === "development")
    global.prisma = prisma;
exports.default = prisma;
