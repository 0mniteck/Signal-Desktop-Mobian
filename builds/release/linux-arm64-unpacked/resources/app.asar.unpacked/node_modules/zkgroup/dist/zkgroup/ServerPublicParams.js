"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByteArray_1 = require("./internal/ByteArray");
const IllegalArgumentException_1 = require("./errors/IllegalArgumentException");
const ZkGroupError_1 = require("./errors/ZkGroupError");
const VerificationFailedException_1 = require("./errors/VerificationFailedException");
const Native_1 = require("./internal/Native");
const FFICompatArray_1 = require("./internal/FFICompatArray");
class ServerPublicParams extends ByteArray_1.default {
    constructor(contents) {
        super(contents, ServerPublicParams.SIZE, true);
        var ffi_return = Native_1.default.FFI_ServerPublicParams_checkValidContents(contents, contents.length);
        if (ffi_return == Native_1.FFI_RETURN_INPUT_ERROR) {
            throw new IllegalArgumentException_1.default('FFI_RETURN_INPUT_ERROR');
        }
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN != OK');
        }
    }
    verifySignature(message, notarySignature) {
        const notarySignatureContents = notarySignature.getContents();
        var ffi_return = Native_1.default.FFI_ServerPublicParams_verifySignature(this.contents, this.contents.length, message, message.length, notarySignatureContents, notarySignatureContents.length);
        if (ffi_return == Native_1.FFI_RETURN_INPUT_ERROR) {
            throw new VerificationFailedException_1.default('Signature failed');
        }
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN != OK');
        }
    }
    serialize() {
        return new FFICompatArray_1.default(Buffer.from(this.contents.buffer));
    }
}
exports.default = ServerPublicParams;
ServerPublicParams.SIZE = 161;
