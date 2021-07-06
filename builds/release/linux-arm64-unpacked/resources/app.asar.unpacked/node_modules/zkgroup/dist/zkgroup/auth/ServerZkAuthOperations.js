"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const FFICompatArray_1 = require("../internal/FFICompatArray");
const ZkGroupError_1 = require("../errors/ZkGroupError");
const VerificationFailedException_1 = require("../errors/VerificationFailedException");
const Constants_1 = require("../internal/Constants");
const Native_1 = require("../internal/Native");
const AuthCredentialResponse_1 = require("./AuthCredentialResponse");
const UUIDUtil_1 = require("../internal/UUIDUtil");
class ServerZkAuthOperations {
    constructor(serverSecretParams) {
        this.serverSecretParams = serverSecretParams;
    }
    issueAuthCredential(uuid, redemptionTime) {
        const random = new FFICompatArray_1.default(crypto_1.randomBytes(Constants_1.RANDOM_LENGTH));
        return this.issueAuthCredentialWithRandom(random, uuid, redemptionTime);
    }
    issueAuthCredentialWithRandom(random, uuid, redemptionTime) {
        const newContents = new FFICompatArray_1.default(AuthCredentialResponse_1.default.SIZE);
        const serverParamContents = this.serverSecretParams.getContents();
        const uuidContents = UUIDUtil_1.fromUUID(uuid);
        const ffi_return = Native_1.default.FFI_ServerSecretParams_issueAuthCredentialDeterministic(serverParamContents, serverParamContents.length, random, random.length, uuidContents, uuidContents.length, redemptionTime, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN!=OK');
        }
        return new AuthCredentialResponse_1.default(newContents);
    }
    verifyAuthCredentialPresentation(groupPublicParams, authCredentialPresentation) {
        const serverParamContents = this.serverSecretParams.getContents();
        const groupPublicContents = groupPublicParams.getContents();
        const authCredentialPresentationContents = authCredentialPresentation.getContents();
        const ffi_return = Native_1.default.FFI_ServerSecretParams_verifyAuthCredentialPresentation(serverParamContents, serverParamContents.length, groupPublicContents, groupPublicContents.length, authCredentialPresentationContents, authCredentialPresentationContents.length);
        if (ffi_return == Native_1.FFI_RETURN_INPUT_ERROR) {
            throw new VerificationFailedException_1.default('FFI_RETURN_INPUT_ERROR');
        }
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN!=OK');
        }
    }
}
exports.default = ServerZkAuthOperations;
