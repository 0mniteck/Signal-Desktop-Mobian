import { types } from 'ref-napi';

import * as RefArray from 'ref-array-napi';

// Typescript complains that RefArray is not constructable. But it very much is
// @ts-ignore
const FFICompatArray: RefArray.ArrayType<number> = new RefArray(types.uint8)

export default FFICompatArray;

export type FFICompatArrayType = RefArray.ArrayTypeInstance<number>;
