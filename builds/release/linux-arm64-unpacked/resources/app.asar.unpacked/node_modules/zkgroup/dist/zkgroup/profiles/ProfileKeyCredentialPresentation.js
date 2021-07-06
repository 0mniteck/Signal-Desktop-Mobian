"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByteArray_1 = require("../internal/ByteArray");
const FFICompatArray_1 = require("../internal/FFICompatArray");
const InvalidInputException_1 = require("../errors/InvalidInputException");
const ZkGroupError_1 = require("../errors/ZkGroupError");
const Native_1 = require("../internal/Native");
const UuidCiphertext_1 = require("../groups/UuidCiphertext");
const ProfileKeyCiphertext_1 = require("../groups/ProfileKeyCiphertext");
class ProfileKeyCredentialPresentation extends ByteArray_1.default {
    constructor(contents) {
        super(contents, ProfileKeyCredentialPresentation.SIZE, true);
        const ffi_return = Native_1.default.FFI_ProfileKeyCredentialPresentation_checkValidContents(this.contents, this.contents.length);
        if (ffi_return == Native_1.FFI_RETURN_INPUT_ERROR) {
            throw new InvalidInputException_1.default('FFI_RETURN_INPUT_ERROR');
        }
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN!=OK');
        }
    }
    getUuidCiphertext() {
        const newContents = new FFICompatArray_1.default(UuidCiphertext_1.default.SIZE);
        const ffi_return = Native_1.default.FFI_ProfileKeyCredentialPresentation_getUuidCiphertext(this.contents, this.contents.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN!=OK');
        }
        return new UuidCiphertext_1.default(newContents);
    }
    getProfileKeyCiphertext() {
        const newContents = new FFICompatArray_1.default(ProfileKeyCiphertext_1.default.SIZE);
        const ffi_return = Native_1.default.FFI_ProfileKeyCredentialPresentation_getProfileKeyCiphertext(this.contents, this.contents.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN!=OK');
        }
        return new ProfileKeyCiphertext_1.default(newContents);
    }
}
exports.default = ProfileKeyCredentialPresentation;
ProfileKeyCredentialPresentation.SIZE = 713;
