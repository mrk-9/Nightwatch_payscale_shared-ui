import StringManager from '../StringManager';

// Pass through type export so can be consumed without direct reference to
// StringManager class
export { StringModule } from '../StringManager';

// Create an export a singleton StringManager instance to be used by entire application
// Need to typecast so can be referenced as strings.foo.bar
// tslint:disable-next-line no-any
export const strings = new StringManager() as any;
export default strings;
