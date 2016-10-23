var path = require('path');


module.exports = {
    entry: {
        main:'./src/monads.ts',
    },
    output:{
            library: 'maybe-not',
            libraryTarget: 'umd',
            path: __dirname,
            filename: 'bundle.js'
        },
        resolve: {
            extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
        },
        module: {
        loaders: [
        {test: /\.ts/, include: [path.resolve(__dirname, "src")], loader: 'babel-loader!ts-loader'}
        ]
    }
};
