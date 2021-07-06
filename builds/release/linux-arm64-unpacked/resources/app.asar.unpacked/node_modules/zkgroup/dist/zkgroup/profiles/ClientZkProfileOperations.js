"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const FFICompatArray_1 = require("../internal/FFICompatArray");
const ZkGroupError_1 = require("../errors/ZkGroupError");
const VerificationFailedException_1 = require("../errors/VerificationFailedException");
const Constants_1 = require("../internal/Constants");
const Native_1 = require("../internal/Native");
const ProfileKeyCredentialRequestContext_1 = require("./ProfileKeyCredentialRequestContext");
const ProfileKeyCredential_1 = require("./ProfileKeyCredential");
const ProfileKeyCredentialPresentation_1 = require("./ProfileKeyCredentialPresentation");
const UUIDUtil_1 = require("../internal/UUIDUtil");
class ClientZkProfileOperations {
    constructor(serverPublicParams) {
        this.serverPublicParams = serverPublicParams;
    }
    createProfileKeyCredentialRequestContext(uuid, profileKey) {
        const random = new FFICompatArray_1.default(crypto_1.randomBytes(Constants_1.RANDOM_LENGTH));
        return this.createProfileKeyCredentialRequestContextWithRandom(random, uuid, profileKey);
    }
    createProfileKeyCredentialRequestContextWithRandom(random, uuid, profileKey) {
        const newContents = new FFICompatArray_1.default(ProfileKeyCredentialRequestContext_1.default.SIZE);
        const serverPublicParamsContents = this.serverPublicParams.getContents();
        const uuidContents = UUIDUtil_1.fromUUID(uuid);
        const profileKeyContents = profileKey.getContents();
        const ffi_return = Native_1.default.FFI_ServerPublicParams_createProfileKeyCredentialRequestContextDeterministic(serverPublicParamsContents, serverPublicParamsContents.length, random, random.length, uuidContents, uuidContents.length, profileKeyContents, profileKeyContents.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default("FFI_RETURN!=OK");
        }
        return new ProfileKeyCredentialRequestContext_1.default(newContents);
    }
    receiveProfileKeyCredential(profileKeyCredentialRequestContext, profileKeyCredentialResponse) {
        const newContents = new FFICompatArray_1.default(ProfileKeyCredential_1.default.SIZE);
        const serverPublicParamsContents = this.serverPublicParams.getContents();
        const profileKeyCredentialRequestContextContents = profileKeyCredentialRequestContext.getContents();
        const profileKeyCredentialResponseContents = profileKeyCredentialResponse.getContents();
        const ffi_return = Native_1.default.FFI_ServerPublicParams_receiveProfileKeyCredential(serverPublicParamsContents, serverPublicParamsContents.length, profileKeyCredentialRequestContextContents, profileKeyCredentialRequestContextContents.length, profileKeyCredentialResponseContents, profileKeyCredentialResponseContents.length, newContents, newContents.length);
        if (ffi_return == Native_1.FFI_RETURN_INPUT_ERROR) {
            throw new VerificationFailedException_1.default('FFI_RETURN_INPUT_ERROR');
        }
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default("FFI_RETURN!=OK");
        }
        return new ProfileKeyCredential_1.default(newContents);
    }
    createProfileKeyCredentialPresentation(groupSecretParams, profileKeyCredential) {
        const random = new FFICompatArray_1.default(crypto_1.randomBytes(Constants_1.RANDOM_LENGTH));
        return this.createProfileKeyCredentialPresentationWithRandom(random, groupSecretParams, profileKeyCredential);
    }
    createProfileKeyCredentialPresentationWithRandom(random, groupSecretParams, profileKeyCredential) {
        const newContents = new FFICompatArray_1.default(ProfileKeyCredentialPresentation_1.default.SIZE);
        const serverPublicParamsContents = this.serverPublicParams.getContents();
        const groupSecretParamsContents = groupSecretParams.getContents();
        const profileKeyCredentialContents = profileKeyCredential.getContents();
        const ffi_return = Native_1.default.FFI_ServerPublicParams_createProfileKeyCredentialPresentationDeterministic(serverPublicParamsContents, serverPublicParamsContents.length, random, random.length, groupSecretParamsContents, groupSecretParamsContents.length, profileKeyCredentialContents, profileKeyCredentialContents.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default("FFI_RETURN!=OK");
        }
        return new ProfileKeyCredentialPresentation_1.default(newContents);
    }
}
exports.default = ClientZkProfileOperations;
