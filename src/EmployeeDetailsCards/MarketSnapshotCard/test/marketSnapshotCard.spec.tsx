import * as React from 'react';
import { shallow } from 'enzyme';
import MarketSnapshotCard from '../index';
import strings from '../strings';

describe('MarketSnapshotCard', () => {
    const currency = 'USD';
    const marketBaseSalary25th = 33165;
    const marketBaseSalary50th = 45185;
    const marketBaseSalary75th = 59018;
    const marketTotalCash25th = 67836;
    const marketTotalCash50th = 75481;
    const marketTotalCash75th = 92448;

    it ('should show table when total cash comp, base pay, and currency values are passed', () => {
        const marketShapshotCard = shallow(
            <MarketSnapshotCard
                currency={currency}
                marketBaseSalary25th={marketBaseSalary25th}
                marketBaseSalary50th={marketBaseSalary50th}
                marketBaseSalary75th={marketBaseSalary75th}
                marketTotalCash25th={marketTotalCash25th}
                marketTotalCash50th={marketTotalCash50th}
                marketTotalCash75th={marketTotalCash75th}
            />
        );

        expect(marketShapshotCard.find('.market-snapshot-card__table').length).toBe(1);
    });

    it ('should show table when total cash comp and base pay values are zero', () => {
        const marketShapshotCard = shallow(
            <MarketSnapshotCard
                currency={currency}
                marketBaseSalary25th={0}
                marketBaseSalary50th={0}
                marketBaseSalary75th={0}
                marketTotalCash25th={0}
                marketTotalCash50th={0}
                marketTotalCash75th={0}
            />
        );

        expect(marketShapshotCard.find('.market-snapshot-card__table').length).toBe(1);
    });

    it ('should show description when total cash comp, base pay, and currency values are passed', () => {
        const marketShapshotCard = shallow(
            <MarketSnapshotCard
                currency={currency}
                marketBaseSalary25th={marketBaseSalary25th}
                marketBaseSalary50th={marketBaseSalary50th}
                marketBaseSalary75th={marketBaseSalary75th}
                marketTotalCash25th={marketTotalCash25th}
                marketTotalCash50th={marketTotalCash50th}
                marketTotalCash75th={marketTotalCash75th}
            />
        );

        expect(marketShapshotCard.find('.market-snapshot-card__description').length).toBe(1);
    });

    it ('should show description when total cash comp and base pay values are zero', () => {
        const marketShapshotCard = shallow(
            <MarketSnapshotCard
                currency={currency}
                marketBaseSalary25th={0}
                marketBaseSalary50th={0}
                marketBaseSalary75th={0}
                marketTotalCash25th={0}
                marketTotalCash50th={0}
                marketTotalCash75th={0}
            />
        );

        expect(marketShapshotCard.find('.market-snapshot-card__description').length).toBe(1);
    });

    it ('should render nothing when no data is passed', () => {
        const marketShapshotCard = shallow(
            <MarketSnapshotCard
                currency={currency}
            />
        );

        expect(marketShapshotCard.isEmptyRender()).toBe(true);
    });

    it ('should render nothing when all data is null', () => {
        const marketShapshotCard = shallow(
            <MarketSnapshotCard
                currency={currency}
                marketBaseSalary25th={null}
                marketBaseSalary50th={null}
                marketBaseSalary75th={null}
                marketTotalCash25th={null}
                marketTotalCash50th={null}
                marketTotalCash75th={null}
            />
        );

        expect(marketShapshotCard.isEmptyRender()).toBe(true);
    });

    it('table should have a row for each percentile', () => {
        const marketShapshotCard = shallow(
            <MarketSnapshotCard
                marketBaseSalary25th={43210}
                marketBaseSalary50th={43210}
                marketBaseSalary75th={43210}
                marketTotalCash25th={54321}
                marketTotalCash50th={54321}
                marketTotalCash75th={54321}
                currency="USD"
            />
        );
        expect(marketShapshotCard.find('tbody tr').length).toBe(3);
    });

    it('table should contain perctentile strings', () => {
        const marketShapshotCard = shallow(
            <MarketSnapshotCard
                marketBaseSalary25th={43210}
                marketBaseSalary50th={43210}
                marketBaseSalary75th={43210}
                marketTotalCash25th={54321}
                marketTotalCash50th={54321}
                marketTotalCash75th={54321}
                currency="USD"
            />
        );
        const h6 = marketShapshotCard.find('.percentile').first();
        expect(h6.text()).toBe(strings.percentile25th);
    });
});