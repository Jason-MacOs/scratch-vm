const jsBeautify = require('js-beautify');

const jsBeautifier = function(message) {
    return jsBeautify.js_beautify(message);
}

module.exports = jsBeautifier;
