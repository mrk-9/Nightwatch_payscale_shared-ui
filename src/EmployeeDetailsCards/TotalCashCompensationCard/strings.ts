import { strings as stringManager } from '../../Strings'; // string manager singleton

// define namespace for module strings
export const moduleName = 'eeCompensationCard';
export interface ModuleStrings {
    cardTitle: string;
    description: string;
    notApplicable: string;
}

// Load strings into string manager, enforcing the type
// (all strings defined, no new ones)
stringManager.load(moduleName, <ModuleStrings> {
    cardTitle: 'Total Cash Compensation',
    description: 'Base Pay + Bonus, Incentives and Commission',
    notApplicable: 'N/A'
});

// export just this modules strings as a typed object, such that
// values can be referenced via 'strings.manager'
const moduleStrings = stringManager[moduleName] as ModuleStrings;
export { moduleStrings as strings };
export default moduleStrings;
