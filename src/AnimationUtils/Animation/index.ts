export const enum EasingEquation {
    Linear = 0,
    EaseOutSine,
    EaseInOutSine,
    EaseOutQuad,
    EaseInQuint,
    EaseInOutQuint
}

const PI_D2 = Math.PI / 2;

interface EasingFunc {
    (pos: number): number;
}

// easing equations from https://github.com/danro/easing-js/blob/master/easing.js
const easingEquations: { [type: number]: EasingFunc } = {};

easingEquations[EasingEquation.Linear] = (pos: number) => {
    return pos;
};
easingEquations[EasingEquation.EaseOutSine] = (pos: number) => {
    return Math.sin(pos * PI_D2);
};
easingEquations[EasingEquation.EaseInOutSine] = (pos: number) => {
    return -0.5 * (Math.cos(Math.PI * pos) - 1);
};
easingEquations[EasingEquation.EaseOutQuad] = (pos: number) => {
    return -(Math.pow(pos - 1, 2) - 1);
};
easingEquations[EasingEquation.EaseInQuint] = (pos: number) => {
    return Math.pow(pos, 5);
};
easingEquations[EasingEquation.EaseInOutQuint] = (pos: number) => {
    const curPos = pos / 0.5;
    if (curPos < 1) {
        return 0.5 * Math.pow(curPos, 5);
    }
    return 0.5 * (Math.pow(curPos - 2, 5) + 2);
};
// Class which represents a single animation
class Animation {
    private _startVal: number;
    private _endVal: number;
    private _delta: number;
    private _durationMS: number;
    private _startTime: number;
    private _easing: EasingEquation;
    private _onUpdate: Function;
    private _onComplete: Function;

    constructor(
        startVal: number,
        endVal: number,
        duration: number,
        easing: EasingEquation,
        onUpdate: Function,
        onComplete: Function
    ) {
        this._delta = endVal - startVal;
        this._durationMS = duration * 1000;
        this._startTime = 0;
        this._easing = easing;
        this._startVal = startVal;
        this._endVal = endVal;
        this._onUpdate = onUpdate;
        this._onComplete = onComplete;
        this.start();
    }

    start(): void {
        this._startTime = Math.floor(window.performance.now());
    }

    update(now: number): boolean {
        const p: number = (now - this._startTime) / this._durationMS;
        const t = easingEquations[this._easing](p);

        if (p < 1) {
            this._onUpdate(this._startVal + this._delta * t);
            return false;
        } else {
            this._onUpdate(this._endVal);
            if (this._onComplete) {
                this._onComplete();
            }
            return true;
        }
    }
}

export { Animation };
export default Animation;
