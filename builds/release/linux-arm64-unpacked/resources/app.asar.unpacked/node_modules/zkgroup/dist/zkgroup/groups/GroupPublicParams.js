"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByteArray_1 = require("../internal/ByteArray");
const FFICompatArray_1 = require("../internal/FFICompatArray");
const InvalidInputException_1 = require("../errors/InvalidInputException");
const ZkGroupError_1 = require("../errors/ZkGroupError");
const Native_1 = require("../internal/Native");
const GroupIdentifier_1 = require("./GroupIdentifier");
class GroupPublicParams extends ByteArray_1.default {
    constructor(contents) {
        super(contents, GroupPublicParams.SIZE, true);
        const ffi_return = Native_1.default.FFI_GroupPublicParams_checkValidContents(this.contents, this.contents.length);
        if (ffi_return == Native_1.FFI_RETURN_INPUT_ERROR) {
            throw new InvalidInputException_1.default('FFI_RETURN_INPUT_ERROR');
        }
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN!=OK');
        }
    }
    getGroupIdentifier() {
        const newContents = new FFICompatArray_1.default(GroupIdentifier_1.default.SIZE);
        const ffi_return = Native_1.default.FFI_GroupPublicParams_getGroupIdentifier(this.contents, this.contents.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN!=OK');
        }
        return new GroupIdentifier_1.default(newContents);
    }
}
exports.default = GroupPublicParams;
GroupPublicParams.SIZE = 97;
