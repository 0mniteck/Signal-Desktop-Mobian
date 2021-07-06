"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const Native_1 = require("./internal/Native");
const FFICompatArray_1 = require("./internal/FFICompatArray");
const ByteArray_1 = require("./internal/ByteArray");
const IllegalArgumentException_1 = require("./errors/IllegalArgumentException");
const ZkGroupError_1 = require("./errors/ZkGroupError");
const Constants_1 = require("./internal/Constants");
const ServerPublicParams_1 = require("./ServerPublicParams");
const NotarySignature_1 = require("./NotarySignature");
class ServerSecretParams extends ByteArray_1.default {
    constructor(contents) {
        super(contents, ServerSecretParams.SIZE, true);
        var ffi_return = Native_1.default.FFI_ServerSecretParams_checkValidContents(contents, contents.length);
        if (ffi_return == Native_1.FFI_RETURN_INPUT_ERROR) {
            throw new IllegalArgumentException_1.default('FFI_RETURN_INPUT_ERROR');
        }
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN != OK');
        }
    }
    static generate() {
        const random = new FFICompatArray_1.default(crypto_1.randomBytes(Constants_1.RANDOM_LENGTH));
        return ServerSecretParams.generateWithRandom(random);
    }
    static generateWithRandom(random) {
        const newContents = new FFICompatArray_1.default(ServerSecretParams.SIZE);
        if (random.length !== 32) {
            throw new IllegalArgumentException_1.default('random length was not 32');
        }
        if (newContents.length !== ServerSecretParams.SIZE) {
            throw new IllegalArgumentException_1.default('newContents was not expected size');
        }
        var ffi_return = Native_1.default.FFI_ServerSecretParams_generateDeterministic(random, random.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN != OK');
        }
        return new ServerSecretParams(newContents);
    }
    getPublicParams() {
        const newContents = FFICompatArray_1.default(ServerPublicParams_1.default.SIZE);
        var ffi_return = Native_1.default.FFI_ServerSecretParams_getPublicParams(this.contents, this.contents.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN != OK');
        }
        return new ServerPublicParams_1.default(newContents);
    }
    sign(message) {
        const random = new FFICompatArray_1.default(crypto_1.randomBytes(Constants_1.RANDOM_LENGTH));
        return this.signWithRandom(random, message);
    }
    signWithRandom(random, message) {
        const newContents = new FFICompatArray_1.default(NotarySignature_1.default.SIZE);
        var ffi_return = Native_1.default.FFI_ServerSecretParams_signDeterministic(this.contents, this.contents.length, random, random.length, message, message.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN != OK');
        }
        return new NotarySignature_1.default(newContents);
    }
    serialize() {
        return this.contents.slice(0, this.contents.length);
    }
}
exports.default = ServerSecretParams;
ServerSecretParams.SIZE = 769;
