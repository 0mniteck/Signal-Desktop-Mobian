"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUID_LENGTH = 16;
const FFICompatArray_1 = require("./FFICompatArray");
function toUUID(array) {
    const hex = array.buffer.toString('hex');
    return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}`;
}
exports.toUUID = toUUID;
function fromUUID(uuid) {
    let i = 0;
    let array = new FFICompatArray_1.default(16);
    uuid.replace(/[0-9A-F]{2}/ig, (oct) => {
        array[i++] = parseInt(oct, 16);
        return '';
    });
    return array;
}
exports.fromUUID = fromUUID;
