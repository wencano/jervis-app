/**
 * Usage: webpack -p
 *
 * Reference: https://www.phase2technology.com/blog/bundle-your-front-end-with-webpack/
 **/
 
var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require("path");

var config = {
	
	entry: { /**
		plugins: [
			'./theme-assets/plugins/jQueryUI/jquery-ui.min.js',
			'./theme-assets/bootstrap/js/bootstrap.min.js',
			'./theme-assets/plugins/fastclick/fastclick.js',
			'./theme-assets/plugins/sparkline/jquery.sparkline.min.js',
			'./theme-assets/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js',
			'./theme-assets/plugins/jvectormap/jquery-jvectormap-world-mill-en.js',
			'./theme-assets/plugins/slimScroll/jquery.slimscroll.min.js',
			'./theme-assets/plugins/chartjs/Chart.min.js',
			'./theme-assets/plugins/moment/moment.min.js',
			'./theme-assets/plugins/daterangepicker/daterangepicker.js',
			'./theme-assets/plugins/datepicker/bootstrap-datepicker.js',
			'./theme-assets/plugins/colorpicker/bootstrap-colorpicker.min.js',
			'./theme-assets/plugins/timepicker/bootstrap-timepicker.min.js',
			'./theme-assets/plugins/iCheck/icheck.min.js',
			'./theme-assets/plugins/select2/select2.full.min.js',
			'./theme-assets/plugins/pace/pace.min.js',
			'./theme-assets/dist/js/app.js'
		], */
		vendor: [ 
			'moment',
			'moment-timezone',
			'lodash',
			'react', 
			'react-dom', 
			'react-router',
			'react-touch-screen-keyboard',
			'react-dropzone',
			'react-treeview',
			'react-nl2br',
			'react-select2',
			'react-select2-wrapper'
		],
		app: 		[
			'./src/index.js'
		]
		
	},
	
	externals: {
		"jquery": "jQuery"
	},
		
	output: {
		path:'./app/assets/',
		filename: '[name].min.js',
		sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
	},
	
	devServer: {
		inline: true,
		//host: '192.168.1.3',
		port: 5000,
		historyApiFallback: true
	},
	
	resolve: {
    extensions: ['', '.js', '.jsx']
  },
	
	module: {
		loaders: [
			{
				test: /\.(js|jsx)?$/,
				exclude: /(node_modules)/,
				loader: 'babel',
				query: {
					presets: ['es2015', 'react'],
					plugins: ["transform-object-rest-spread"]
				}
			}, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.css$/,
        include: path.join(__dirname, 'src'),
        loaders: ['style-loader', 'css-loader'],
      }
		]
	}, /**
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
			'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
		new webpack.optimize.UglifyJsPlugin({
			minimize: true
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin()

	] */
}

module.exports = config;