"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidInputException extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidInputException';
    }
}
exports.default = InvalidInputException;
