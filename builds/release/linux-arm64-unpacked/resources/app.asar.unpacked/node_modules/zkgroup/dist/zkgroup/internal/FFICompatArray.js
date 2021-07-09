"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ref_napi_1 = require("ref-napi");
const ArrayType = require("ref-array-napi");
// Typescript complains that RefArray is not constructable. But it very much is
const FFICompatArray = ArrayType(ref_napi_1.types.uint8);
exports.default = FFICompatArray;
