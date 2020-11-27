import isEqual from 'lodash-es/isEqual.js';

const isObject = value => typeof value === 'object' && typeof value !== null;
const isFunction = value => typeof value === 'function';
const { isArray } = Array;

export default function match(arg) {
  return function(...matchers) {
    let result;
    let hasDefaultResult;
    let defaultCallback;

    const hasSuccessfullyMatched = matchers.some(matcher => {
      /* If something matches, return the callback */
      const callback = matcher[matcher.length-1];

      /* Loop through the values in matcher except for the last one, because its the callback */
      for(let i = 0; i < matcher.length - 1; i++) {
        const valueToMatch = matcher[i];

        if(isFunction(valueToMatch)) {
          /* Its a predicate, execute to get the result with the arg `valueToMatch(arg)` */
          if(valueToMatch(arg)) {
            result = callback;
            return true;
          }
        }

        if(isArray(valueToMatch) || isObject(valueToMatch)) {
          if(isEqual(arg, valueToMatch)) {
            result = callback;
            return true;
          }
        }

        if(valueToMatch === arg) {
          result = callback;
          return true;
        }
      }

      /* Sets the default option */
      if(typeof matcher[0] === 'undefined') {
        hasDefaultResult = true;
        defaultCallback = matcher[1];
      }
    });

    /* If nothing has matched, and a default case was provided */
    if(!hasSuccessfullyMatched && hasDefaultResult) {
      return defaultCallback();
    }

    return result();
  }
}