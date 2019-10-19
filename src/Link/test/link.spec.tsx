import * as React from 'react';
import { shallow } from 'enzyme';
import { Link } from '../index';
import HistoryApi from '../../Types/historyApi';

// test helper
const testLinkClick = (clickEvent: {}, expectApiCall: boolean) => {
    let calledWithUrl: string = null;
    const linkUrl = 'http://ilikecheese.gov';
    const testHistory: HistoryApi = {
        goBack: null,
        goForward: null,
        push: (url) => calledWithUrl = url,
        replace: null
    };

    const result = shallow(
        <Link history={testHistory} href={linkUrl}>
            Foo
        </Link>
    );

    let defaultPrevented = false;
    const event = Object.assign({}, clickEvent, {
        preventDefault: () => defaultPrevented = true
    });

    result.find('a').at(0).simulate('click', event);
    expect(calledWithUrl).toBe(expectApiCall ? linkUrl : null);
    expect(defaultPrevented).toBe(expectApiCall);
};

describe('Link', () => {
    it('should render an anchor tag with proper text', () => {
        const linkText = 'foo';
        const result = shallow(<Link history={null}>{linkText}</Link>);
        expect(result.text()).toBe(linkText);
        expect(result.find('a').length).toBe(1);
    });

    it('should apply className from props', () => {
        const linkText = 'foo';
        const className = 'wumpus';
        const result = shallow(
            <Link history={null} className={className}>
                {linkText}
            </Link>);
        expect(result.find('a').at(0).hasClass(className)).toBe(true);
    });

    it('should call history.push() with URL on click', () => {
        testLinkClick({button: 0}, true);
    });

    it('should not call history.push() with URL on right click', () => {
        testLinkClick({button: 1}, false);
    });

    it('should bypass history API when ctrl + clicked', () => {
        testLinkClick({
            button: 0,
            ctrlKey: true
        },
        false);
    });

    it('should bypass history API when meta + clicked', () => {
        testLinkClick({
            button: 0,
            metaKey: true
        },
        false);
    });

    it('should bypass history API when shift + clicked', () => {
        testLinkClick({
            button: 0,
            shiftKey: true
        },
        false);
    });

    it('should not call historyApi if click handler prevents default', () => {
        let calledWithUrl: string = null;
        const linkUrl = 'http://ilikecheese.gov';
        const testHistory: HistoryApi = {
            goBack: null,
            goForward: null,
            push: (url) => calledWithUrl = url,
            replace: null
        };

        // tslint:disable-next-line no-any
        const clickHandler = (e: any) => e.defaultPrevented = true;

        const result = shallow(
            <Link history={testHistory} href={linkUrl} onClick={clickHandler}>
                Foo
            </Link>
        );

        const clickEvent = {
            button: 0,
            preventDefault: () => {}
        };

        result.find('a').at(0).simulate('click', clickEvent);
        expect(calledWithUrl).toBe(null);
    });
});
