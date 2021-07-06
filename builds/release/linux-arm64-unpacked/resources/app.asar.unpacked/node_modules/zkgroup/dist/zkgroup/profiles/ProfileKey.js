"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByteArray_1 = require("../internal/ByteArray");
const FFICompatArray_1 = require("../internal/FFICompatArray");
const ZkGroupError_1 = require("../errors/ZkGroupError");
const Native_1 = require("../internal/Native");
const ProfileKeyCommitment_1 = require("./ProfileKeyCommitment");
const ProfileKeyVersion_1 = require("./ProfileKeyVersion");
const UUIDUtil_1 = require("../internal/UUIDUtil");
class ProfileKey extends ByteArray_1.default {
    constructor(contents) {
        super(contents, ProfileKey.SIZE, true);
    }
    getCommitment(uuid) {
        const newContents = new FFICompatArray_1.default(ProfileKeyCommitment_1.default.SIZE);
        const uuidContents = UUIDUtil_1.fromUUID(uuid);
        const ffi_return = Native_1.default.FFI_ProfileKey_getCommitment(this.contents, this.contents.length, uuidContents, uuidContents.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN!=OK');
        }
        return new ProfileKeyCommitment_1.default(newContents);
    }
    getProfileKeyVersion(uuid) {
        const newContents = new FFICompatArray_1.default(ProfileKeyVersion_1.default.SIZE);
        const uuidContents = UUIDUtil_1.fromUUID(uuid);
        const ffi_return = Native_1.default.FFI_ProfileKey_getProfileKeyVersion(this.contents, this.contents.length, uuidContents, uuidContents.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN!=OK');
        }
        return new ProfileKeyVersion_1.default(newContents);
    }
}
exports.default = ProfileKey;
ProfileKey.SIZE = 32;
