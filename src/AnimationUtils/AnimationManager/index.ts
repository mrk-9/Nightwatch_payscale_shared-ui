import Animation, { EasingEquation } from '../Animation';

// singleton AnimationManager "class"
class AnimationManager {
    private _animations: Animation[];
    private _requestId: number;
    private _updateCallback: FrameRequestCallback;

    constructor() {
        this._animations = [];
        this._requestId = 0;
        this._updateCallback = this._updateAnimations.bind(this);
    }

    // main interface for creating new animations, which will be run by the manager
    createAnimation(
        startVal: number,
        endVal: number,
        duration: number,
        easing: EasingEquation,
        onUpdate: Function,
        onComplete?: Function
    ): void {
        this._addAnimation(
            new Animation(
                startVal,
                endVal,
                duration,
                easing,
                onUpdate,
                onComplete
            )
        );
    }

    private _addAnimation(animation: Animation): void {
        this._animations.push(animation);

        // if update not already pending, schedule one
        if (this._requestId === 0) {
            this._requestId = window.requestAnimationFrame(
                this._updateCallback
            );
        }
    }

    private _updateAnimations(): void {
        // request next animation frame immediately, even though the current
        // animation stack may complete
        this._requestId = window.requestAnimationFrame(this._updateCallback);

        // iterate through and update our pending animations
        const continuingAnimations = new Array<Animation>();
        this._animations.forEach(animation => {
            const animationComplete = animation.update(window.performance.now());
            if (animationComplete === false) {
                continuingAnimations.push(animation);
            }
        });

        this._animations = continuingAnimations;

        // cancel animation frame if the animations stack has completed
        if (this._animations.length === 0) {
            window.cancelAnimationFrame(this._requestId);
            this._requestId = 0;
        }
    }
}

const animationManager = new AnimationManager();
export { animationManager, AnimationManager };
export default animationManager;
