const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

global.window = window;
global.window.fetch = () => null;
global.document = window.document;
global.navigator = {
    userAgent: 'node.js'
};

// Make React happy/not warn
global.requestAnimationFrame = () => {};

global.window.requestAnimationFrame = (callback) => {
    setTimeout(callback, 1000 / 60);
    return 1;
};

global.window.performance = {
    now: () => new Date().getTime()
};