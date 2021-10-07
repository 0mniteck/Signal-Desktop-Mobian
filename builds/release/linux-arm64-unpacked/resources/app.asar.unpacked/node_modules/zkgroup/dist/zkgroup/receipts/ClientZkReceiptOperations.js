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
const ZkGroupError_1 = require("../errors/ZkGroupError");
const Constants_1 = require("../internal/Constants");
const Native_1 = require("../internal/Native");
const ReceiptCredential_1 = require("./ReceiptCredential");
const ReceiptCredentialPresentation_1 = require("./ReceiptCredentialPresentation");
const ReceiptCredentialRequestContext_1 = require("./ReceiptCredentialRequestContext");
class ClientZkReceiptOperations {
    constructor(serverPublicParams) {
        this.serverPublicParams = serverPublicParams;
    }
    createReceiptCredentialRequestContext(receiptSerial) {
        const random = new FFICompatArray_1.default(crypto_1.randomBytes(Constants_1.RANDOM_LENGTH));
        return this.createReceiptCredentialRequestContextWithRandom(random, receiptSerial);
    }
    createReceiptCredentialRequestContextWithRandom(random, receiptSerial) {
        const newContents = new FFICompatArray_1.default(ReceiptCredentialRequestContext_1.default.SIZE);
        const serverPublicParamsContents = this.serverPublicParams.getContents();
        const receiptSerialContents = receiptSerial.getContents();
        const ffi_return = Native_1.default.FFI_ServerPublicParams_createReceiptCredentialRequestContextDeterministic(serverPublicParamsContents, serverPublicParamsContents.length, random, random.length, receiptSerialContents, receiptSerialContents.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default("FFI_RETURN!=OK");
        }
        return new ReceiptCredentialRequestContext_1.default(newContents);
    }
    receiveReceiptCredential(receiptCredentialRequestContext, receiptCredentialResponse) {
        const newContents = new FFICompatArray_1.default(ReceiptCredential_1.default.SIZE);
        const serverPublicParamsContents = this.serverPublicParams.getContents();
        const receiptCredentialRequestContextContents = receiptCredentialRequestContext.getContents();
        const receiptCredentialResponseContents = receiptCredentialResponse.getContents();
        const ffi_return = Native_1.default.FFI_ServerPublicParams_receiveReceiptCredential(serverPublicParamsContents, serverPublicParamsContents.length, receiptCredentialRequestContextContents, receiptCredentialRequestContextContents.length, receiptCredentialResponseContents, receiptCredentialResponseContents.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default("FFI_RETURN!=OK");
        }
        return new ReceiptCredential_1.default(newContents);
    }
    createReceiptCredentialPresentation(receiptCredential) {
        const random = new FFICompatArray_1.default(crypto_1.randomBytes(Constants_1.RANDOM_LENGTH));
        return this.createReceiptCredentialPresentationWithRandom(random, receiptCredential);
    }
    createReceiptCredentialPresentationWithRandom(random, receiptCredential) {
        const newContents = new FFICompatArray_1.default(ReceiptCredentialPresentation_1.default.SIZE);
        const serverPublicParamsContents = this.serverPublicParams.getContents();
        const receiptCredentialContents = receiptCredential.getContents();
        const ffi_return = Native_1.default.FFI_ServerPublicParams_createReceiptCredentialPresentationDeterministic(serverPublicParamsContents, serverPublicParamsContents.length, random, random.length, receiptCredentialContents, receiptCredentialContents.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default("FFI_RETURN!=OK");
        }
        return new ReceiptCredentialPresentation_1.default(newContents);
    }
}
exports.default = ClientZkReceiptOperations;
