"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimBoard = void 0;
const trimBoard = (v) => `${v}`
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .join('\n');
exports.trimBoard = trimBoard;
