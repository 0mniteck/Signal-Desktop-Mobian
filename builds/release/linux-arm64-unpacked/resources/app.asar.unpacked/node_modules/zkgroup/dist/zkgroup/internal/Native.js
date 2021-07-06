"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const ffi_napi_1 = require("ffi-napi");
const FFICompatArray_1 = require("./FFICompatArray");
exports.FFI_RETURN_OK = 0;
exports.FFI_RETURN_INTERNAL_ERROR = 1; // ZkGroupError
exports.FFI_RETURN_INPUT_ERROR = 2;
exports.RANDOM_LENGTH = 32;
// One more directory up than expected, since this is run from the dist directory after the Typescript build
const rootPath = path_1.resolve(`${__dirname}/../../../`);
// We need to do things differently if we are in an app.asar, common in the Electron world
const libraryPath = path_1.join(rootPath.replace('app.asar', 'app.asar.unpacked'), 'libzkgroup');
const library = ffi_napi_1.Library(libraryPath, {
    'FFI_ProfileKey_getCommitment': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_ProfileKey_getProfileKeyVersion': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_ProfileKeyCommitment_checkValidContents': ['int', [FFICompatArray_1.default, 'uint32']],
    'FFI_GroupSecretParams_generateDeterministic': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_GroupSecretParams_deriveFromMasterKey': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_GroupSecretParams_getMasterKey': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_GroupSecretParams_getPublicParams': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_GroupSecretParams_checkValidContents': ['int', [FFICompatArray_1.default, 'uint32']],
    'FFI_GroupSecretParams_encryptUuid': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_GroupSecretParams_decryptUuid': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_GroupSecretParams_encryptProfileKey': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_GroupSecretParams_decryptProfileKey': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_GroupSecretParams_encryptBlobDeterministic': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_GroupSecretParams_decryptBlob': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_ServerSecretParams_generateDeterministic': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_ServerSecretParams_getPublicParams': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_ServerSecretParams_signDeterministic': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_ServerSecretParams_checkValidContents': ['int', [FFICompatArray_1.default, 'uint32']],
    'FFI_ServerPublicParams_receiveAuthCredential': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', 'int', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_ServerPublicParams_createAuthCredentialPresentationDeterministic': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_ServerPublicParams_createProfileKeyCredentialRequestContextDeterministic': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_ServerPublicParams_receiveProfileKeyCredential': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_ServerPublicParams_createProfileKeyCredentialPresentationDeterministic': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_ServerSecretParams_issueAuthCredentialDeterministic': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', 'int', FFICompatArray_1.default, 'uint32',]],
    'FFI_ServerSecretParams_verifyAuthCredentialPresentation': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32']],
    'FFI_ServerSecretParams_issueProfileKeyCredentialDeterministic': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_ServerSecretParams_verifyProfileKeyCredentialPresentation': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32']],
    'FFI_GroupPublicParams_getGroupIdentifier': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_GroupPublicParams_checkValidContents': ['int', [FFICompatArray_1.default, 'uint32']],
    'FFI_ServerPublicParams_verifySignature': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32']],
    'FFI_ServerPublicParams_checkValidContents': ['int', [FFICompatArray_1.default, 'uint32']],
    'FFI_AuthCredentialResponse_checkValidContents': ['int', [FFICompatArray_1.default, 'uint32']],
    'FFI_AuthCredential_checkValidContents': ['int', [FFICompatArray_1.default, 'uint32']],
    'FFI_AuthCredentialPresentation_getUuidCiphertext': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_AuthCredentialPresentation_getRedemptionTime': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_AuthCredentialPresentation_checkValidContents': ['int', [FFICompatArray_1.default, 'uint32']],
    'FFI_ProfileKeyCredentialRequestContext_getRequest': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_ProfileKeyCredentialRequestContext_checkValidContents': ['int', [FFICompatArray_1.default, 'uint32']],
    'FFI_ProfileKeyCredentialRequest_checkValidContents': ['int', [FFICompatArray_1.default, 'uint32']],
    'FFI_ProfileKeyCredentialResponse_checkValidContents': ['int', [FFICompatArray_1.default, 'uint32']],
    'FFI_ProfileKeyCredential_checkValidContents': ['int', [FFICompatArray_1.default, 'uint32']],
    'FFI_ProfileKeyCredentialPresentation_getUuidCiphertext': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_ProfileKeyCredentialPresentation_getProfileKeyCiphertext': ['int', [FFICompatArray_1.default, 'uint32', FFICompatArray_1.default, 'uint32',]],
    'FFI_ProfileKeyCredentialPresentation_checkValidContents': ['int', [FFICompatArray_1.default, 'uint32']],
    'FFI_UuidCiphertext_checkValidContents': ['int', [FFICompatArray_1.default, 'uint32']],
    'FFI_ProfileKeyCiphertext_checkValidContents': ['int', [FFICompatArray_1.default, 'uint32']],
});
exports.default = library;
