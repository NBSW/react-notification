var path = require('path');
var webpack = require('webpack');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.js');
var pathToReactDom = path.resolve(node_modules, 'react-dom/dist/react-dom.js');

config = {
	entry: ['webpack/hot/dev-server',
  				path.resolve(__dirname, 'app/main.js')],
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
		}],
		noParse: [pathToReact]
	},
	devServer: {
    contentBase: "",
    publicPath: '/static/',
    noInfo: true, //  --no-info option
    hot: true,
    port: 3002,
    host: '0.0.0.0',
    inline: true,
    colors: true,
    historyApiFallback: true
  },
	plugins: [new webpack.HotModuleReplacementPlugin()],
}

module.exports = config;