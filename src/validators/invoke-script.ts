import { TRANSACTION_TYPE } from '@decentralchain/ts-types';
import {
  defaultValue,
  getError,
  gte,
  ifElse,
  isArray,
  isEq,
  isNaturalNumberLike,
  isNaturalNumberOrZeroLike,
  isNumberLike,
  isPublicKey,
  isRecipient,
  isRequired,
  isString,
  isValidDataPair,
  isDccOrAssetId,
  orEq,
  pipe,
  prop,
  validateByShema,
  validatePipe,
} from './validators';

const invokeScheme = {
  type: isEq(TRANSACTION_TYPE.INVOKE_SCRIPT),
  senderPublicKey: isPublicKey,
  version: orEq([undefined, 1, 2]),
  dApp: isRecipient,

  call: ifElse(
    isRequired(false),
    defaultValue(true),
    validatePipe(
      pipe(prop('function'), isString),
      pipe(prop('function'), prop('length'), gte(0)),
      pipe(prop('args'), isArray),
      (data: Array<unknown>) => data.every(validatePipe(isRequired(true), isValidDataPair)),
    ),
  ),
  payment: validatePipe(isArray, (data: Array<unknown>) =>
    data.every(
      validatePipe(pipe(prop('amount'), isNumberLike), pipe(prop('assetId'), isDccOrAssetId)),
    ),
  ),
  fee: isNaturalNumberOrZeroLike,
  feeAssetId: isDccOrAssetId,
  chainId: isNaturalNumberLike,
  timestamp: isNaturalNumberLike,
  proofs: ifElse(isArray, defaultValue(true), orEq([undefined])),
};

export const invokeValidator = validateByShema(invokeScheme, getError);
