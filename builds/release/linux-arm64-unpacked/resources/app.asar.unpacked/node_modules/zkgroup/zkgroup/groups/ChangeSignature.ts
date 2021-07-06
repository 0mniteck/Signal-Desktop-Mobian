import { FFICompatArrayType } from '../internal/FFICompatArray';
import ByteArray from '../internal/ByteArray';

export default class ChangeSignature extends ByteArray {

  static SIZE = 64;

  constructor(contents: FFICompatArrayType) {
    super(contents, ChangeSignature.SIZE, true);
  }
}
