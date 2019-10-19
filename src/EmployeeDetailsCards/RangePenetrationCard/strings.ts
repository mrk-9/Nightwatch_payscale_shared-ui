import { strings as stringManager } from '../../Strings'; // string manager singleton

// define namespace for module strings
export const moduleName = 'rangePenetrationCard';
export interface ModuleStrings {
    blurb: string;
    cardTitle: string;
    max: string;
    min: string;
}

// Load strings into string manager, enforcing the type
// (all strings defined, no new ones)
stringManager.load(moduleName, <ModuleStrings> {
    blurb: 'How far into the job\'s range has their pay progressed?',
    cardTitle: 'Range Penetration',
    max: 'Max',
    min: 'Min'
});

// export just this modules strings as a typed object, such that
// values can be referenced via 'strings.manager'
const moduleStrings = stringManager[moduleName] as ModuleStrings;
export { moduleStrings as strings };
export default moduleStrings;
