import MockHistory from './mockHistory';

describe('MockHistory', () => {
    let mockHistory: MockHistory;
    beforeEach(() => {
        mockHistory = new MockHistory(null, null);
    });

    describe('should update state', () => {
        it('when new state is pushed', () => {
            // expect empty by default
            expect(mockHistory.state).toEqual({});

            const newState = {
                foo: 'bar'
            };
            mockHistory.pushState(newState, '', '');
            expect(mockHistory.state).toBe(newState);
        });

        it('when state is replaced', () => {
            // expect empty by default
            expect(mockHistory.state).toEqual({});

            const newState = {
                foo: 'bar'
            };
            mockHistory.replaceState(newState, '', '');
            expect(mockHistory.state).toBe(newState);
        });

        it('when we go back', () => {
            // expect empty by default
            expect(mockHistory.state).toEqual({});

            const state1 = {
                foo: 'bar'
            };

            const state2 = {
                bar: 'foo'
            };

            mockHistory.pushState(state1, '', '');
            expect(mockHistory.state).toBe(state1);

            mockHistory.pushState(state2, '', '');
            expect(mockHistory.state).toBe(state2);

            mockHistory.back();
            expect(mockHistory.state).toBe(state1);
        });

        it('when we go forward', () => {
            // expect empty by default
            expect(mockHistory.state).toEqual({});

            const state1 = {
                foo: 'bar'
            };

            const state2 = {
                bar: 'foo'
            };

            mockHistory.pushState(state1, '', '');
            expect(mockHistory.state).toBe(state1);

            mockHistory.pushState(state2, '', '');
            expect(mockHistory.state).toBe(state2);

            mockHistory.back();
            expect(mockHistory.state).toBe(state1);

            mockHistory.forward();
            expect(mockHistory.state).toBe(state2);
        });
    });
});
