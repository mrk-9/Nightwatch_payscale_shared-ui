// Module interface for collections of strings
export interface StringModule {
    [key: string]: string;
}

// Object which provides an interface for dynamic lookup of string values
//
// Takes modules of strings as input (which are namespaced)
// and exposes an interface of stringManager.<moduleName>.<stringKey> to get the current
// version of that string
export class StringManager {
    // Load a new module/collection of strings which will be available via:
    // stringManager.<moduleName>.<stringKey>
    load(name: string, module: StringModule): void {
        if (!module || !this._isValidModuleName(name)) {
            return;
        }

        // tslint:disable-next-line no-any
        (this as any)[name] = module;
    }

    // Apply this module/collection of strings as an overlay on top of the existing
    // strings, if any exist
    override(name: string, overrideStrings: StringModule): void {
        if (!module || !this._isValidModuleName(name)) {
            return;
        }

        // if trying to override module that doesn't exist, just
        // treat as a load
        if (!(this as any)[name]) { // tslint:disable-line no-any
            this.load(name, overrideStrings);
        } else {
            // tslint:disable-next-line no-any
            const moduleStrings: StringModule = (this as any)[name];
            Object.keys(overrideStrings).forEach((key: string) => {
                moduleStrings[key] = overrideStrings[key];
            });
        }
    }

    private _isValidModuleName(name: string): boolean {
        // don't allow module names to collide with our method names
        return name && name !== 'load' && name !== 'override';
    }
}

export default StringManager;
