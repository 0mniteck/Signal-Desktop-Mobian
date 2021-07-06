"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VerificationFailedException extends Error {
    constructor(message) {
        super(message);
        this.name = 'VerificationFailedException';
    }
}
exports.default = VerificationFailedException;
