"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogInput = exports.createBlogInput = exports.signInBody = exports.signUpBody = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signUpBody = zod_1.default.object({
    name: zod_1.default.string().min(1),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
});
exports.signInBody = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
});
exports.createBlogInput = zod_1.default.object({
    title: zod_1.default.string(),
    content: zod_1.default.any()
});
exports.updateBlogInput = zod_1.default.object({
    title: zod_1.default.string(),
    content: zod_1.default.any(),
    id: zod_1.default.string()
});
