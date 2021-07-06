"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AssertionError extends Error {
    constructor(message) {
        super();
        this.name = 'AssertionError';
    }
}
exports.default = AssertionError;
