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
class ReceiptSerial extends ByteArray_1.default {
    constructor(contents) {
        super(contents, ReceiptSerial.SIZE, true);
    }
}
exports.default = ReceiptSerial;
ReceiptSerial.SIZE = 16;
