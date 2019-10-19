import { strings as stringManager } from '../../Strings'; // string manager singleton

// define namespace for module strings
export const moduleName = 'marketSnapshotCard';
export interface ModuleStrings {
    basePayHeader: string;
    cardTitle: string;
    description: string;
    percentile25th: string;
    percentile50th: string;
    percentile75th: string;
    tccHeader: string;
}

// Load strings into string manager, enforcing the type
// (all strings defined, no new ones)
stringManager.load(moduleName, <ModuleStrings> {
    basePayHeader: 'Annual Base Pay',
    cardTitle: 'Market Snapshot',
    description: '* Base salary, bonus, and other '
        + 'factors are all collected separately and may not add up to TCC',
    percentile25th: '25th',
    percentile50th: '50th',
    percentile75th: '75th',
    tccHeader: 'TCC*'
});

// export just this modules strings as a typed object, such that
// values can be referenced via 'strings.manager'
const moduleStrings = stringManager[moduleName] as ModuleStrings;
export { moduleStrings as strings };
export default moduleStrings;
