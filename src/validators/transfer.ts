import {
  isEq,
  orEq,
  isDccOrAssetId,
  isRecipient,
  isAttachment,
  isArray,
  getError,
  validateByShema,
  ifElse,
  defaultValue,
  isPublicKey,
  isNaturalNumberLike,
  isNaturalNumberOrZeroLike,
} from './validators';
import { TRANSACTION_TYPE } from '@decentralchain/ts-types';

const transferScheme = {
  type: isEq(TRANSACTION_TYPE.TRANSFER),
  senderPublicKey: isPublicKey,
  version: orEq([undefined, 2, 3]),
  assetId: isDccOrAssetId,
  feeAssetId: isDccOrAssetId,
  recipient: isRecipient,
  amount: isNaturalNumberOrZeroLike,
  attachment: isAttachment,
  fee: isNaturalNumberOrZeroLike,
  chainId: isNaturalNumberLike,
  timestamp: isNaturalNumberOrZeroLike,
  proofs: ifElse(isArray, defaultValue(true), orEq([undefined])),
};

export const transferValidator = validateByShema(transferScheme, getError);
