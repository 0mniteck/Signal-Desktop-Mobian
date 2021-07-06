"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const FFICompatArray_1 = require("../internal/FFICompatArray");
const VerificationFailedException_1 = require("../errors/VerificationFailedException");
const ZkGroupError_1 = require("../errors/ZkGroupError");
const Native_1 = require("../internal/Native");
const Constants_1 = require("../internal/Constants");
const ProfileKeyCredentialResponse_1 = require("./ProfileKeyCredentialResponse");
const UUIDUtil_1 = require("../internal/UUIDUtil");
class ServerZkProfileOperations {
    constructor(serverSecretParams) {
        this.serverSecretParams = serverSecretParams;
    }
    issueProfileKeyCredential(profileKeyCredentialRequest, uuid, profileKeyCommitment) {
        const random = new FFICompatArray_1.default(crypto_1.randomBytes(Constants_1.RANDOM_LENGTH));
        return this.issueProfileKeyCredentialWithRandom(random, profileKeyCredentialRequest, uuid, profileKeyCommitment);
    }
    issueProfileKeyCredentialWithRandom(random, profileKeyCredentialRequest, uuid, profileKeyCommitment) {
        const newContents = new FFICompatArray_1.default(ProfileKeyCredentialResponse_1.default.SIZE);
        const serverSecretParamsContents = this.serverSecretParams.getContents();
        const profileKeyCredentialRequestContents = profileKeyCredentialRequest.getContents();
        const uuidContents = UUIDUtil_1.fromUUID(uuid);
        const profileKeyCommitmentContents = profileKeyCommitment.getContents();
        const ffi_return = Native_1.default.FFI_ServerSecretParams_issueProfileKeyCredentialDeterministic(serverSecretParamsContents, serverSecretParamsContents.length, random, random.length, profileKeyCredentialRequestContents, profileKeyCredentialRequestContents.length, uuidContents, uuidContents.length, profileKeyCommitmentContents, profileKeyCommitmentContents.length, newContents, newContents.length);
        if (ffi_return == Native_1.FFI_RETURN_INPUT_ERROR) {
            throw new VerificationFailedException_1.default('FFI_RETURN_INPUT_ERROR');
        }
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN!=OK');
        }
        return new ProfileKeyCredentialResponse_1.default(newContents);
    }
    verifyProfileKeyCredentialPresentation(groupPublicParams, profileKeyCredentialPresentation) {
        const serverSecretParamsContents = this.serverSecretParams.getContents();
        const groupPublicParamsContents = groupPublicParams.getContents();
        const profileKeyCredentialPresentationContents = profileKeyCredentialPresentation.getContents();
        const ffi_return = Native_1.default.FFI_ServerSecretParams_verifyProfileKeyCredentialPresentation(serverSecretParamsContents, serverSecretParamsContents.length, groupPublicParamsContents, groupPublicParamsContents.length, profileKeyCredentialPresentationContents, profileKeyCredentialPresentationContents.length);
        if (ffi_return == Native_1.FFI_RETURN_INPUT_ERROR) {
            throw new VerificationFailedException_1.default('FFI_RETURN_INPUT_ERROR');
        }
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN!=OK');
        }
    }
}
exports.default = ServerZkProfileOperations;
