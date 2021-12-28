"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimLines = void 0;
const trimLines = (v) => `${v}`
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .join('\n');
exports.trimLines = trimLines;
