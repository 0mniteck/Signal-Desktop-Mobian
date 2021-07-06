"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByteArray_1 = require("./internal/ByteArray");
class NotarySignature extends ByteArray_1.default {
    constructor(contents) {
        super(contents, NotarySignature.SIZE, true);
    }
}
exports.default = NotarySignature;
NotarySignature.SIZE = 64;
