"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const FFICompatArray_1 = require("../internal/FFICompatArray");
const ZkGroupError_1 = require("../errors/ZkGroupError");
const VerificationFailedException_1 = require("../errors/VerificationFailedException");
const Native_1 = require("../internal/Native");
const Constants_1 = require("../internal/Constants");
const AuthCredential_1 = require("./AuthCredential");
const AuthCredentialPresentation_1 = require("./AuthCredentialPresentation");
const UUIDUtil_1 = require("../internal/UUIDUtil");
class ClientZkAuthOperations {
    constructor(serverPublicParams) {
        this.serverPublicParams = serverPublicParams;
    }
    receiveAuthCredential(uuid, redemptionTime, authCredentialResponse) {
        const newContents = new FFICompatArray_1.default(AuthCredential_1.default.SIZE);
        const serverPublicParamsContents = this.serverPublicParams.getContents();
        const uuidContents = UUIDUtil_1.fromUUID(uuid);
        const authCredentialResponseContents = authCredentialResponse.getContents();
        const ffi_return = Native_1.default.FFI_ServerPublicParams_receiveAuthCredential(serverPublicParamsContents, serverPublicParamsContents.length, uuidContents, uuidContents.length, redemptionTime, authCredentialResponseContents, authCredentialResponseContents.length, newContents, newContents.length);
        if (ffi_return == Native_1.FFI_RETURN_INPUT_ERROR) {
            throw new VerificationFailedException_1.default("FFI_RETURN_INPUT_ERROR");
        }
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default("FFI_RETURN!=OK");
        }
        return new AuthCredential_1.default(newContents);
    }
    createAuthCredentialPresentation(groupSecretParams, authCredential) {
        const random = new FFICompatArray_1.default(crypto_1.randomBytes(Constants_1.RANDOM_LENGTH));
        return this.createAuthCredentialPresentationWithRandom(random, groupSecretParams, authCredential);
    }
    createAuthCredentialPresentationWithRandom(random, groupSecretParams, authCredential) {
        const newContents = new FFICompatArray_1.default(AuthCredentialPresentation_1.default.SIZE);
        const serverPublicParamsContents = this.serverPublicParams.getContents();
        const groupSecretParamsContents = groupSecretParams.getContents();
        const authCredentialContents = authCredential.getContents();
        const ffi_return = Native_1.default.FFI_ServerPublicParams_createAuthCredentialPresentationDeterministic(serverPublicParamsContents, serverPublicParamsContents.length, random, random.length, groupSecretParamsContents, groupSecretParamsContents.length, authCredentialContents, authCredentialContents.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default("FFI_RETURN!=OK");
        }
        return new AuthCredentialPresentation_1.default(newContents);
    }
}
exports.default = ClientZkAuthOperations;
