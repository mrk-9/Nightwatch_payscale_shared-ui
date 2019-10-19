import { strings as stringManager } from '../../Strings'; // string manager singleton

// define namespace for module strings
export const moduleName = 'eeDetailsCard';
export interface ModuleStrings {
    department: string;
    email: string;
    employeeId: string;
    hireDate: string;
    location: string;
    manager: string;
}

// Load strings into string manager, enforcing the type
// (all strings defined, no new ones)
stringManager.load(moduleName, <ModuleStrings> {
    department: 'Department',
    email: 'Email',
    employeeId: 'Employee ID',
    hireDate: 'Hire Date',
    location: 'Location',
    manager: 'Reports To'
});

// export just this modules strings as a typed object, such that
// values can be referenced via 'strings.manager'
const moduleStrings = stringManager[moduleName] as ModuleStrings;
export { moduleStrings as strings };
export default moduleStrings;
