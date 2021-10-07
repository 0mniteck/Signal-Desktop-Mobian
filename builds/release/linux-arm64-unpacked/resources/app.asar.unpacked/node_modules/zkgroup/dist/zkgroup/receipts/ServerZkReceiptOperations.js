"use strict";
/*
 *
 * Copyright (C) 2021 Signal Messenger, LLC.
 * All rights reserved.
 *
 * SPDX-License-Identifier: GPL-3.0-only
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const FFICompatArray_1 = require("../internal/FFICompatArray");
const VerificationFailedException_1 = require("../errors/VerificationFailedException");
const ZkGroupError_1 = require("../errors/ZkGroupError");
const Native_1 = require("../internal/Native");
const Constants_1 = require("../internal/Constants");
const ReceiptCredentialResponse_1 = require("./ReceiptCredentialResponse");
class ServerZkReceiptOperations {
    constructor(serverSecretParams) {
        this.serverSecretParams = serverSecretParams;
    }
    issueReceiptCredential(receiptCredentialRequest, receiptExpirationTime, receiptLevel) {
        const random = new FFICompatArray_1.default(crypto_1.randomBytes(Constants_1.RANDOM_LENGTH));
        return this.issueReceiptCredentialWithRandom(random, receiptCredentialRequest, receiptExpirationTime, receiptLevel);
    }
    issueReceiptCredentialWithRandom(random, receiptCredentialRequest, receiptExpirationTime, receiptLevel) {
        const newContents = new FFICompatArray_1.default(ReceiptCredentialResponse_1.default.SIZE);
        const serverSecretParamsContents = this.serverSecretParams.getContents();
        const receiptCredentialRequestContents = receiptCredentialRequest.getContents();
        const ffi_return = Native_1.default.FFI_ServerSecretParams_issueReceiptCredentialDeterministic(serverSecretParamsContents, serverSecretParamsContents.length, random, random.length, receiptCredentialRequestContents, receiptCredentialRequestContents.length, receiptExpirationTime, receiptLevel, newContents, newContents.length);
        if (ffi_return == Native_1.FFI_RETURN_INPUT_ERROR) {
            throw new VerificationFailedException_1.default('FFI_RETURN_INPUT_ERROR');
        }
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN!=OK');
        }
        return new ReceiptCredentialResponse_1.default(newContents);
    }
    verifyReceiptCredentialPresentation(receiptCredentialPresentation) {
        const serverSecretParamsContents = this.serverSecretParams.getContents();
        const receiptCredentialPresentationContents = receiptCredentialPresentation.getContents();
        const ffi_return = Native_1.default.FFI_ServerSecretParams_verifyReceiptCredentialPresentation(serverSecretParamsContents, serverSecretParamsContents.length, receiptCredentialPresentationContents, receiptCredentialPresentationContents.length);
        if (ffi_return == Native_1.FFI_RETURN_INPUT_ERROR) {
            throw new VerificationFailedException_1.default('FFI_RETURN_INPUT_ERROR');
        }
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN!=OK');
        }
    }
}
exports.default = ServerZkReceiptOperations;
