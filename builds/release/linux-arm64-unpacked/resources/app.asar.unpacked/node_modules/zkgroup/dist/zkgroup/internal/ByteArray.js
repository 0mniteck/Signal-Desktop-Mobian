"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FFICompatArray_1 = require("./FFICompatArray");
const InvalidInputException_1 = require("../errors/InvalidInputException");
class ByteArray {
    constructor(contents, expectedLength, unrecoverable) {
        if (contents.length !== expectedLength) {
            throw new InvalidInputException_1.default(`Length of array supplied was ${contents.length} expected ${expectedLength}`);
        }
        this.contents = contents.slice(0, expectedLength);
    }
    getContents() {
        return this.contents;
    }
    serialize() {
        // Note: we can't relay on Buffer.slice, since it returns a reference to the same
        //   uinderlying memory
        const array = Uint8Array.prototype.slice.call(this.contents.buffer);
        const buffer = Buffer.from(array);
        return new FFICompatArray_1.default(buffer);
    }
}
exports.default = ByteArray;
