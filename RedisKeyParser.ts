/**
 * Parses a Redis key to extract the throttling conditions and expiration time.
 * @param key The Redis key to parse.
 * @returns An object containing the throttling conditions and expiration time.
 */
function parseRedisKey(key: string): {
  throttleConditions: { function: string; value: number | string }[];
  expiresInSeconds: number;
} {
  // Split the key into components
  const parts = key.split('$');

  let throttleConditions: { function: string; value: number | string }[] = [];
  let expiresInSeconds = 0;

  // Loop through the components to identify the throttle conditions and expiration
  for (const part of parts) {
    if (part.startsWith('t')) {
      // Extract the throttle conditions
      const throttleExpressions = part.slice(1).split(',');
      for (const expression of throttleExpressions) {
        const op = expression[0];
        const value = expression.slice(1);
        let condition = {
          function: '',
          value: 0,
        };

        switch (op) {
          case '%':
            condition.function = 'modulo';
            condition.value = parseInt(value, 10);
            break;
          case '<':
            condition.function = 'lessthan';
            condition.value = parseInt(value, 10);
            break;
          case '>':
            condition.function = 'greaterthan';
            condition.value = parseInt(value, 10);
            break;
          case '=':
            condition.function = 'equalto';
            condition.value = parseInt(value, 10);
            break;
          case '!':
            condition.function = 'notequalto';
            condition.value = parseInt(value, 10);
            break;
        }

        throttleConditions.push(condition);
      }
    } else if (part.startsWith('e=')) {
      // Extract expiration time
      expiresInSeconds = parseInt(part.slice(2), 10);
    }
  }

  return {
    throttleConditions,
    expiresInSeconds,
  };
}

/**
 * Determines whether the Redis key should be cached based on the throttling conditions and expiration information.
 * @param parsedKey Parsed key details.
 * @param value The value to check against the throttling criteria.
 * @returns Whether the Redis key should be cached.
 */
function shouldCache(parsedKey: {
  throttleConditions: { function: string; value: number }[];
  expiresInSeconds: number;
}, value: number): boolean {
  const { throttleConditions } = parsedKey;

  // Check the throttling conditions
  for (const condition of throttleConditions) {
    switch (condition.function) {
      case 'modulo':
        if (value % condition.value !== 0) {
          return false;
        }
        break;
      case 'lessthan':
        if (value >= condition.value) {
          return false;
        }
        break;
      case 'greaterthan':
        if (value <= condition.value) {
          return false;
        }
        break;
      case 'equalto':
        if (value !== condition.value) {
          return false;
        }
        break;
      case 'notequalto':
        if (value === condition.value) {
          return false;
        }
        break;
    }
  }

  return true; // If all conditions are met
}

// Example usage
const redisKey = 'user:auth$token$t%5,!10,e=3600';
const parsedKey = parseRedisKey(redisKey);

// Value to compare against the throttling condition
const someValue = 15; // Any value to test throttling

const shouldCacheResult = shouldCache(parsedKey, someValue);

console.log(`Should cache: ${shouldCacheResult}`); // Output will indicate whether caching should occur
