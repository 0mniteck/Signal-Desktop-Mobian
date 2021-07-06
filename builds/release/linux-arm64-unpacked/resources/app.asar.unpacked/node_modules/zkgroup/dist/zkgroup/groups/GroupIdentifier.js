"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByteArray_1 = require("../internal/ByteArray");
class GroupIdentifier extends ByteArray_1.default {
    constructor(contents) {
        super(contents, GroupIdentifier.SIZE, true);
    }
}
exports.default = GroupIdentifier;
GroupIdentifier.SIZE = 32;
