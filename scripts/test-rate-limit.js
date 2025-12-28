const { isRateLimited } = require("../lib/rateLimit");

const windowMs = 1000;
const key = "user-1";
const map = new Map();

function check(label, actual, expected) {
  const ok = actual === expected;
  const status = ok ? "PASS" : "FAIL";
  console.log(`${status} ${label} -> expected=${expected} actual=${actual}`);
  if (!ok) {
    throw new Error(`Assertion failed: ${label}`);
  }
}

check("first request allowed", isRateLimited(map, key, 0, windowMs), false);
check(
  "second request within window blocked",
  isRateLimited(map, key, 250, windowMs),
  true
);
check(
  "request after 1s allowed",
  isRateLimited(map, key, 1000, windowMs),
  false
);
check(
  "request within window after reset blocked",
  isRateLimited(map, key, 1750, windowMs),
  true
);
check(
  "different user allowed",
  isRateLimited(map, "user-2", 1750, windowMs),
  false
);

console.log("rate-limit tests passed");
