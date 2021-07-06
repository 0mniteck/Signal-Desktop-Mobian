"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ZkGroupError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ZkGroupError';
    }
}
exports.default = ZkGroupError;
