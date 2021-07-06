"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByteArray_1 = require("../internal/ByteArray");
const FFICompatArray_1 = require("../internal/FFICompatArray");
class ProfileKeyVersion extends ByteArray_1.default {
    constructor(contents) {
        super(typeof contents === 'string' ? new FFICompatArray_1.default(Buffer.from(contents)) : contents, ProfileKeyVersion.SIZE, false);
    }
    toString() {
        return this.contents.buffer.toString('utf8');
    }
}
exports.default = ProfileKeyVersion;
ProfileKeyVersion.SIZE = 64;
