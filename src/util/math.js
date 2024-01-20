
export function lawOfCosinesSide(theta /* :number */, b /* :number */, c /* :number */) /* :number */ {
    return Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(theta));
}


export function clampedLerp(a/* :number */, b /* :number */, t /* :number */, maxDiff /* :number */) {
    t = Math.max(0, Math.min(1, t));

    const change = Math.max(Math.min((b - a) * t, maxDiff), -maxDiff);
    return a + change;
}

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

export function lawOfCosinesAngle(a/* :number */, b/* :number */, c/* :number */)/* :number */ {
    return Math.acos((a * a - b * b - c * c) / (-2 * b * c));
}