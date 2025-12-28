/**
 * Returns true when the request should be rate-limited.
 * @param {Map<string, number>} lastRequestByKey
 * @param {string} key
 * @param {number} nowMs
 * @param {number} windowMs
 */
function isRateLimited(lastRequestByKey, key, nowMs, windowMs) {
  const lastRequest = lastRequestByKey.get(key);
  if (lastRequest !== undefined && nowMs - lastRequest < windowMs) {
    return true;
  }
  lastRequestByKey.set(key, nowMs);
  return false;
}

module.exports = { isRateLimited };
