var path = require('path');
var webpack = require('webpack');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.js');
var pathToReactDom = path.resolve(node_modules, 'react-dom/dist/react-dom.js');

config = {
	entry: ['webpack/hot/dev-server',
  				path.resolve(__dirname, 'app/main.jsx')],
	resolve: {
		alias: {
			'react': pathToReact,
			'react-dom': pathToReactDom
		}
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js',
		publicPath: '/static/'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			loader: 'babel-loader',
			 exclude: /node_modules/,
			query: {
        presets: ['es2015', 'react']
    	}
		}],
		noParse: [pathToReact]
	},
	devServer: {
    contentBase: "./app",
    publicPath: '/static/',
    noInfo: true, //  --no-info option
    hot: true,
    inline: true,
    colors: true,
    historyApiFallback: true
  },
	plugins: [new webpack.HotModuleReplacementPlugin()],
}

module.exports = config;