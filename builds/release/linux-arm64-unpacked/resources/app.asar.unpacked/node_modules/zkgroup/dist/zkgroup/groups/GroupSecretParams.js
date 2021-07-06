"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const ByteArray_1 = require("../internal/ByteArray");
const FFICompatArray_1 = require("../internal/FFICompatArray");
const ZkGroupError_1 = require("../errors/ZkGroupError");
const IllegalArgumentException_1 = require("../errors/IllegalArgumentException");
const Native_1 = require("../internal/Native");
const Constants_1 = require("../internal/Constants");
const GroupMasterKey_1 = require("./GroupMasterKey");
const GroupPublicParams_1 = require("./GroupPublicParams");
class GroupSecretParams extends ByteArray_1.default {
    constructor(contents) {
        super(contents, GroupSecretParams.SIZE, true);
        const ffi_return = Native_1.default.FFI_GroupSecretParams_checkValidContents(this.contents, this.contents.length);
        if (ffi_return == Native_1.FFI_RETURN_INPUT_ERROR) {
            throw new IllegalArgumentException_1.default('FFI_RETURN_INPUT_ERROR');
        }
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN!=OK');
        }
    }
    static generate() {
        const random = new FFICompatArray_1.default(crypto_1.randomBytes(Constants_1.RANDOM_LENGTH));
        return GroupSecretParams.generateWithRandom(random);
    }
    static generateWithRandom(random) {
        const newContents = new FFICompatArray_1.default(GroupSecretParams.SIZE);
        const ffi_return = Native_1.default.FFI_GroupSecretParams_generateDeterministic(random, random.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default("FFI_RETURN!=OK");
        }
        return new GroupSecretParams(newContents);
    }
    static deriveFromMasterKey(groupMasterKey) {
        const newContents = new FFICompatArray_1.default(GroupSecretParams.SIZE);
        const groupMasterKeyContents = groupMasterKey.getContents();
        const ffi_return = Native_1.default.FFI_GroupSecretParams_deriveFromMasterKey(groupMasterKeyContents, groupMasterKeyContents.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default("FFI_RETURN!=OK");
        }
        return new GroupSecretParams(newContents);
    }
    getMasterKey() {
        const newContents = new FFICompatArray_1.default(GroupMasterKey_1.default.SIZE);
        const ffi_return = Native_1.default.FFI_GroupSecretParams_getMasterKey(this.contents, this.contents.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN!=OK');
        }
        return new GroupMasterKey_1.default(newContents);
    }
    getPublicParams() {
        const newContents = new FFICompatArray_1.default(GroupPublicParams_1.default.SIZE);
        const ffi_return = Native_1.default.FFI_GroupSecretParams_getPublicParams(this.contents, this.contents.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default("FFI_RETURN!=OK");
        }
        return new GroupPublicParams_1.default(newContents);
    }
}
exports.default = GroupSecretParams;
GroupSecretParams.SIZE = 289;
