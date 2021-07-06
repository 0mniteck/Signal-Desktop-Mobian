"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByteArray_1 = require("../internal/ByteArray");
class ChangeSignature extends ByteArray_1.default {
    constructor(contents) {
        super(contents, ChangeSignature.SIZE, true);
    }
}
exports.default = ChangeSignature;
ChangeSignature.SIZE = 64;
