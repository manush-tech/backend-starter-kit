import { customAlphabet } from "nanoid";

/**
 * @module utils/v1/uid
 */

const OTPNumbers = "0123456789";
const capNums = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/**
 * @function
 * @memberof module:utils/v1/uid
 * @name uuid4
 * @returns {number}
 */
export const uuid4 = customAlphabet(OTPNumbers, 4);

/**
 * @function
 * @memberof module:utils/v1/uid
 * @name uuid6
 * @returns {number}
 */
export const uuid6 = customAlphabet(OTPNumbers, 6);

/**
 * @function
 * @memberof module:utils/v1/uid
 * @name uuid8
 * @returns {string}
 */
export const uuid8 = customAlphabet(capNums, 8);

/**
 * @function
 * @memberof module:utils/v1/uid
 * @name uuid10
 * @returns {string}
 */
export const uuid10 = customAlphabet(alphabet, 10);

/**
 * @function
 * @memberof module:utils/v1/uid
 * @name uuid16
 * @returns {string}
 */
export const uuid16 = customAlphabet(alphabet, 16);

/**
 * @function
 * @memberof module:utils/v1/uid
 * @name uuid32
 * @returns {string}
 */
export const uuid32 = customAlphabet(alphabet, 32);

/**
 * @function
 * @memberof module:utils/v1/uid
 * @name uuid64
 * @returns {string}
 */
export const uuid64 = customAlphabet(alphabet, 64);
