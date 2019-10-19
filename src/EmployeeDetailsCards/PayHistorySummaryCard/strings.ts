import { strings as stringManager } from '../../Strings';

export const moduleName = 'payHistorySummaryCard';
export interface ModuleStrings {
    descriptionIncrease: string;
    descriptionDecrease: string;
    percentageIncrease: string;
    percentageDecrease: string;
    noChange: string;
}

stringManager.load(moduleName, <ModuleStrings> {
    descriptionIncrease: '{0}\'s pay increased from {1} to {2} in the last {3} years.',
    descriptionDecrease: '{0}\'s pay decreased from {1} to {2} in the last {3} years.',
    percentageIncrease: 'This is an increase of',
    percentageDecrease: 'This is a decrease of',
    noChange: '{0} does not have any pay history data.'
});

const moduleStrings = stringManager[moduleName] as ModuleStrings;
export { moduleStrings as strings };
export default moduleStrings;