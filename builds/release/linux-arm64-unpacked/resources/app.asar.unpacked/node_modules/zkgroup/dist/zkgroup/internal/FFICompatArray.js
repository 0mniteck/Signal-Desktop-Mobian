"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ref_napi_1 = require("ref-napi");
const RefArray = require("ref-array-napi");
// Typescript complains that RefArray is not constructable. But it very much is
// @ts-ignore
const FFICompatArray = new RefArray(ref_napi_1.types.uint8);
exports.default = FFICompatArray;
