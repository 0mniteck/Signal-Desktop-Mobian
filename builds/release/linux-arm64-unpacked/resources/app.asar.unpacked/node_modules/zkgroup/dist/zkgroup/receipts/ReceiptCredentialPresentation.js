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
const ByteArray_1 = require("../internal/ByteArray");
const FFICompatArray_1 = require("../internal/FFICompatArray");
const InvalidInputException_1 = require("../errors/InvalidInputException");
const ZkGroupError_1 = require("../errors/ZkGroupError");
const Native_1 = require("../internal/Native");
const ReceiptSerial_1 = require("./ReceiptSerial");
class ReceiptCredentialPresentation extends ByteArray_1.default {
    constructor(contents) {
        super(contents, ReceiptCredentialPresentation.SIZE, true);
        const ffi_return = Native_1.default.FFI_ReceiptCredentialPresentation_checkValidContents(this.contents, this.contents.length);
        if (ffi_return == Native_1.FFI_RETURN_INPUT_ERROR) {
            throw new InvalidInputException_1.default('FFI_RETURN_INPUT_ERROR');
        }
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN!=OK');
        }
    }
    getReceiptExpirationTime() {
        const newContents = new FFICompatArray_1.default(Buffer.alloc(8));
        const ffi_return = Native_1.default.FFI_ReceiptCredentialPresentation_getReceiptExpirationTime(this.contents, this.contents.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default("FFI_RETURN!=OK");
        }
        return newContents.buffer.readUInt64BE(0);
    }
    getReceiptLevel() {
        const newContents = new FFICompatArray_1.default(Buffer.alloc(8));
        const ffi_return = Native_1.default.FFI_ReceiptCredentialPresentation_getReceiptLevel(this.contents, this.contents.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default("FFI_RETURN!=OK");
        }
        return newContents.buffer.readUInt64BE(0);
    }
    getReceiptSerialBytes() {
        const newContents = new FFICompatArray_1.default(Buffer.alloc(ReceiptSerial_1.default.SIZE));
        const ffi_return = Native_1.default.FFI_ReceiptCredentialPresentation_getReceiptSerial(this.contents, this.contents.length, newContents, newContents.length);
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default("FFI_RETURN!=OK");
        }
        return new ReceiptSerial_1.default(newContents);
    }
}
exports.default = ReceiptCredentialPresentation;
ReceiptCredentialPresentation.SIZE = 329;
