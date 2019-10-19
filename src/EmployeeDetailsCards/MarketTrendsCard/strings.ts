import { strings as stringManager } from '../../Strings'; // string manager singleton

// define namespace for module strings
export const moduleName = 'marketTrendsCard';
export interface ModuleStrings {
    cardTitle: string;
    dateRangeBlurb: string;
    jobTitleBlurb: string;
}

// Load strings into string manager, enforcing the type
// (all strings defined, no new ones)
stringManager.load(moduleName, <ModuleStrings> {
    cardTitle: 'Market Trends',
    dateRangeBlurb: 'Total change in pay since',
    jobTitleBlurb: 'Based on PayScale job title {0}'
});

// export just this modules strings as a typed object, such that
// values can be referenced via 'strings.manager'
const moduleStrings = stringManager[moduleName] as ModuleStrings;
export { moduleStrings as strings };
export default moduleStrings;
