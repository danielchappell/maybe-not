var path = require('path');

module.exports = {
    entry: {
        main:'./src/maybenot.ts',
    },
    output:{
            library: 'maybe-not',
            libraryTarget: 'amd',
            path: __dirname + '/dist',
            filename: 'maybenot.js'
        },
        resolve: {
            extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
        },
        module: {
        loaders: [
        {test: /\.ts/, include: [path.resolve(__dirname, "src")], loader: 'babel-loader?presets[]=es2015!ts-loader'}
        ]
    }
};
