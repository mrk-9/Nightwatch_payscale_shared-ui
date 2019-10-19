import { strings as stringManager } from '../../Strings'; // string manager singleton

// define namespace for module strings
export const moduleName = 'rangeDistributionCard';
export interface ModuleStrings {
    above: string;
    below: string;
    bottom: string;
    cardTitle: string;
    descriptionInRange: string;
    descriptionInRangeSingular: string;
    descriptionOutRange: string;
    descriptionOutRangeSingular: string;
    descriptionPositionInRange: string;
    descriptionPositionOutRange: string;
    middle: string;
    thisEmployee: string;
    top: string;
}

// Load strings into string manager, enforcing the type
// (all strings defined, no new ones)
stringManager.load(moduleName, <ModuleStrings> {
    above: 'Above',
    below: 'Below',
    bottom: 'Bottom',
    cardTitle: 'Range Distribution',
    descriptionInRange: '{0} and {1} of the organization are in the',
    descriptionInRangeSingular: '{0} is in the',
    descriptionOutRange: '{0} and {1} of the organization are',
    descriptionOutRangeSingular: '{0} is',
    descriptionPositionInRange: 'of the range',
    descriptionPositionOutRange: 'the range',
    middle: 'Middle',
    thisEmployee: 'This employee',
    top: 'Top'
});

// export just this modules strings as a typed object, such that
// values can be referenced via 'strings.manager'
const moduleStrings = stringManager[moduleName] as ModuleStrings;
export { moduleStrings as strings };
export default moduleStrings;
