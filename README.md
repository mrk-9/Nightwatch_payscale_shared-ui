# PayScale Shared UI

Cultivated library of shareable components, utilities, and widgets designed for re-use aross products.

## Installing and Consuming

To use this package:

1) Make sure you have your registry configured for @ps scope (*Note: this shouldn't be necessary due to the .npmrc file in the root folder*)

```sh
npm config set @ps:registry https://proget.bizcont.underpaid.com/npm/payscale-npm
```

2) Install the package via NPM:

```sh
npm install @ps/payscale-shared-ui --save
```

3) Finally, consume it as an ES6 module like any other package, using named imports:

```js
import { buildClassString } from '@ps/payscale-shared-ui/lib/stringUtils';
```

See [Library Contents](#library-contents) for a list of modules available in this package.

## Building The Library

### Prerequisites

This readme assumes you have node, npm, and yarn installed.

### Clone the repository

```sh
git clone git@bitbucket.org:payscale/payscale-shared-ui.git
```

### Install dependencies

Install all required packages using yarn (yarn does a better job de-duping packages than NPM)

```sh
yarn install
```

### Build

There are a few npm scripts which will build this library in different ways:

1. `build-lib`: Main use-case.  Compiles TypeScript source to JavaScript files which can be consumed/imported as ES6 modules via Webpack
2. `build`: Compiles source TypeScript + Sass files to JavaScript code and test bundles, plus unified CSS file to be hosted on a CDN/consumed as external resources
3. `build-prod`: Same as 'build', but with minified JavaScript and CSS

For `build` and `build-prod`, build artifacts are placed in the *dist* folder.  With `build-lib`, all artifacts (.scss, .js, and .d.ts) files are placed in */lib*, with sub-folder structure preserved.

## Tweaking / Bug-fixing

As this library is intended to be consumed via other projects, the most effective way to bugfix or make changes is live within your project.  To do so, you can use either [npm link](https://docs.npmjs.com/cli/link) or [yarn link](https://yarnpkg.com/lang/en/docs/cli/link/), depending on which package manager your project uses, to point your project at your local copy of the library versus the published one.

For this to work:

1. Make sure you've cloned the repository, as described above in 'Building the Library'
1. Build the library by changing to the payscale-shared-ui repository folder and running `yarn build-lib`
1. Run `yarn link` (or `npm link`) from the payscale-shared-ui repostitory folder
1. CD to your project's root directory (where your package.json lives, and parent directory of node_modules)
1. Run `yarn link @ps/payscale-shared-ui` (or `npm link`, as appropriate)
1. Build your project

Note that after you make any code changes to the shared-ui project, you'll need to run `yarn build-lib` again before re-building your project for the changes to be available.

When done, run `yarn unlink` from your project's directory to have it point back at the published version of the library.

## Contributing Code
Code changes should be made by branching off of *master* and creating a pull request when ready to submit for review.  The repository is set up to automatically include a required set of reviewers for each PR.

### Conventions
* Code should be written in TypeScript vs plain JavaScript
* Directory structure should follow existing code:
    * Each module should be placed in a folder under *src*
    * The main source file for a module should be called index.ts/index.tsx
    * Test files should be placed in *test* subfolder
    * Test files should follow naming pattern of *<moduleName>.spec.ts*
    * CSS files should be placed in *style* subfolder
* Use ES6-style module import and export statements
* CSS class naming should follow [BEM pattern](http://getbem.com/naming/)
* JavaScript/TypeScript files should import required SCSS files directly
* Style conventions are enforced by the linter(s), which can be run via `yarn lint`
* Dependencies on third-party libraries should be added as 'peer dependencies' in package.json

### Testing
As this code is for a shared library, code quality and test coverage is important.  As you add new code or fix bugs, please make sure to add appropriate unittest coverage as well.

#### Running Unit Tests
To run unit tests, execute the following script:
```sh
yarn test
```
which will compile the TypeScript code JavaScript and run the tests

#### Debugging Tests
If tests fail and you need to step through the code, you can run them in the browser.
```sh
yarn build
```
will build the source code and tests files. You can then load *test-runner.html* in your browser of choice to run the tests/set breakpoints/etc.

Any code changes you make will require a manual re-build of the project before they show up in the browser

### Publishing
Once you've made code changes you wish to publish (bugfix, new modules, etc), make sure to bump the package version in package.json, then run `npm publish` from the repository root.

The pre-publish script will ensure the project builds and tests and linters run clean before publishing the built library.

**NOTE:** When you make a change to the package version, ensure you tag the commit as well so we can easily checkout this version of the code in the future:

```sh
git tag -a <version>
```

## Library Contents

### `ArrayUtils`

| Function | Description |
|----------|-------------|
| `arrayToDictionary()`  | Given an array, returns a dictionary of items for constant-time lookup |
| `isArrayNullOrEmpty()` | Returns whether the provided array is null/undefined or has zero elements |

### `HistoryUtils`

| Function | Description |
|----------|-------------|
| `parsePath()`  | Parses the specified path into an object, separating out the pathname, search, and hash components |
| `parseQueryParams()` | Parses a query string of form "?foo=bar&stuff=things" and returns a dictionary of key-value pairs (ie {foo: bar, stuff: stings}) |

### `StringUtils`

| Function | Description |
|----------|-------------|
| `buildClassString()` | Given an dictionary of {string: boolean}, builds a space-delimited string of classes to apply to a DOM element.  Only values with a 'true' boolean value will be included |
| `replaceTokens()` | Given a string containing tokens '{0}', '{1}', etc, replaces them with the arguments passed to function and returns the resulting string |

### `TimingUtils`

| Function | Description |
|----------|-------------|
| `throttle()` | Invokes the function parameter, at most, every animation frame |
| `debounce()` | Delays the invokation of the function parameter, until the designated timeout value, has elapsed between calls |


### `BrowserHistory (class)`
Wrapper around HTML5 history api

### `StringManager (class)`
Object which provides an interface for dynamic lookup of string values.  Takes modules of strings as input (which are namespaced) and exposes an interface of stringManager.<moduleName>.<stringKey> to get the current value for that string.

### `AnimationManager (class)`
Using the provided Easing Function, provided by the AnimationUtil, translate between the start and end values with a given duration.

### `Strings (singleton object)`
StringManager instance to be used/shared by entire application.  Used by modules/components in this library, so should be used to override any user-facing text if desired.

### `BarChart (React Component)`
HTML/DOM-based vertical bar chart with categorical (discrete) X-axis and quantitative (numeric) Y-axis.  Supports variable number of bars, optional quantitative axis lines, custom quantitative axis label formatting, and optional bar labels.

### `GrowAnimationContainer (React Component)`
Container component to be used to animate a React component to 'slide' or 'grow' in vertically

### `Link (React Component)`
Basic, unstyled link component designed to work with HTML5 History api.  For single-page apps, will push a new item onto the browser history when clicked, rather than load the new page/URL, retaining the JavaScript context.

### `NavigationPage (React Component)`
The NavigationPage component generates a menu from it's children's anchor tags. It provides the capability to nest the menu items based on anchor tag location within the nested children. Upon scrolling through the page with the ContentNavigation component, each item in the menu will automatically be selected when that section is scrolled to.
