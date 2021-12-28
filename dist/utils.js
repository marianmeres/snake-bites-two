"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimBoard = exports.isFn = void 0;
const isFn = (v) => typeof v === 'function';
exports.isFn = isFn;
const trimBoard = (v) => `${v}`
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .join('\n');
exports.trimBoard = trimBoard;
