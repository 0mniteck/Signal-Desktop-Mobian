"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IllegalArgumentException extends Error {
    constructor(message) {
        super(message);
        this.name = 'IllegalArgumentException';
    }
}
exports.default = IllegalArgumentException;
