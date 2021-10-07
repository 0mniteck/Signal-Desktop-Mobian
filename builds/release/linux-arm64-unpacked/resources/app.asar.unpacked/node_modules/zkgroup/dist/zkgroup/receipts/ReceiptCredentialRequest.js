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
const InvalidInputException_1 = require("../errors/InvalidInputException");
const ZkGroupError_1 = require("../errors/ZkGroupError");
const Native_1 = require("../internal/Native");
class ReceiptCredentialRequest extends ByteArray_1.default {
    constructor(contents) {
        super(contents, ReceiptCredentialRequest.SIZE, true);
        const ffi_return = Native_1.default.FFI_ReceiptCredentialRequest_checkValidContents(this.contents, this.contents.length);
        if (ffi_return == Native_1.FFI_RETURN_INPUT_ERROR) {
            throw new InvalidInputException_1.default('FFI_RETURN_INPUT_ERROR');
        }
        if (ffi_return != Native_1.FFI_RETURN_OK) {
            throw new ZkGroupError_1.default('FFI_RETURN!=OK');
        }
    }
}
exports.default = ReceiptCredentialRequest;
ReceiptCredentialRequest.SIZE = 97;
