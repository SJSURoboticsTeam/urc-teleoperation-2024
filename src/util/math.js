
export const RAD_TO_DEG = 180 / Math.PI; // Multiply to convert radians to degrees
export const DEG_TO_RAD = 1 / RAD_TO_DEG; // Multiply to convert degrees to radians

/**
 * Solver for the opposite side of a triangle, given its angle and the other two sides
 * @param {number} theta Angle A
 * @param {number} b 
 * @param {number} c 
 * @returns {number}
 */
export function lawOfCosinesSide(theta /* :number */, b /* :number */, c /* :number */) /* :number */ {
    return Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(theta));
}


/**
 * Returns a number that lerps between `a` to `b`, but if the absolute deviation from `a` is larger `maxDiff`, the deviation is clamped down to `maxDiff`.
 * 
 * @param {number} a start
 * @param {number} b end
 * @param {number} t usually 0 - 1
 * @param {number} maxDiff Maximum difference
 * @returns {number}
 */
export function clampedLerp(a/* :number */, b /* :number */, t /* :number */, maxDiff /* :number */) {
    t = Math.max(0, Math.min(1, t));

    const change = Math.max(Math.min((b - a) * t, maxDiff), -maxDiff);
    return a + change;
}

/**
 * Returns a number that lerps between `a` to `b`, but if the absolute deviation from `a` is larger `maxDiff`, the deviation is clamped down to `maxDiff`.
 * Deals with full 2pi angle representations.
 * Uses radians.
 * 
 * @param {number} a start
 * @param {number} b end
 * @param {number} t usually 0 - 1
 * @param {number} maxDiff Maximum difference
 * @returns {number}
 */
export function clampedAngularLerp(a/* :number */, b/* :number */, t/* :number */, maxDiff/* :number */) {
    t = Math.max(0, Math.min(1, t));

    let difference = b - a
    if(difference > Math.PI) {
        difference -= Math.PI * 2;
    }else if(difference < -Math.PI) {
        difference += Math.PI * 2;
    }

    const change = Math.max(Math.min(difference * t, maxDiff), -maxDiff);
    return a + change;
}

/**
 * Solve for angle A, given sides a, b, c
 * 
 * @param {number} a 
 * @param {number} b 
 * @param {number} c 
 * @returns {number} Angle A.
 */
export function lawOfCosinesAngle(a/* :number */, b/* :number */, c/* :number */)/* :number */ {
    return Math.acos((a * a - b * b - c * c) / (-2 * b * c));
}

/**
 * Clamp `a` between `min` and `max`.
 * @param {number} a 
 * @param {number} min 
 * @param {number} max 
 * @returns {number} 
 */
export function clamp(a, min, max) {
    return Math.max(Math.min(a, max), min);
}

/**
 * Linearly interpolate between `a` and `b`. Does not clamp.
 * 
 * @param {number} a start
 * @param {number} b end
 * @param {number} t Usually between 0 - 1 
 * @returns {number}
 */
export function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

/**
 * Map `a` from a range of [`inputLower`, `inputHigher`] to [`outputLower`, `outputHigher`]
 * if `a` is `inputLower` will return `outputLower`.
 * if `a` is `inputHigher` will return `outputHigher`.
 * @param {number} a 
 * @param {number} inputLower 
 * @param {number} inputHigher 
 * @param {number} outputLower 
 * @param {number} outputHigher 
 * @returns {number}
 */
export function map(a, inputLower, inputHigher, outputLower, outputHigher) {
    return (outputHigher - outputLower) * (a - inputLower) / (inputHigher - inputLower) + outputLower;
}