import { EasingEquation, animationManager } from '../';

describe('Animation Util', () => {
    describe('Animation', () => {
        let updateCallback: jasmine.Spy;
        let completeCallback: jasmine.Spy;

        beforeEach(() => {
            updateCallback = jasmine.createSpy('updateCallback');
            completeCallback = jasmine.createSpy('completeCallback');
            jasmine.clock().install();
        });

        afterEach(() => {
            jasmine.clock().uninstall();
        });

        it('updates an animation', () => {
            animationManager.createAnimation(
                1,
                2,
                0.1,
                EasingEquation.Linear,
                updateCallback,
                completeCallback
            );
            jasmine.clock().tick(200);
            expect(updateCallback).toHaveBeenCalled();
        });
    });
});
