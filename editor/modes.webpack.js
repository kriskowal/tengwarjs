const path = require('path');

module.exports = {
    entry: './modes.js',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'webpack'),
        filename: 'modes.js',
    }
};
