"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByteArray_1 = require("../internal/ByteArray");
class GroupMasterKey extends ByteArray_1.default {
    constructor(contents) {
        super(contents, GroupMasterKey.SIZE, true);
    }
}
exports.default = GroupMasterKey;
GroupMasterKey.SIZE = 32;
