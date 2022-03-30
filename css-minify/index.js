/**
 * CSS Uglifier 
 */
var uglifycss = require('uglifycss'),
		fs = require('fs');
 
var plugins = [ 
		'../theme-assets/plugins/jvectormap/jquery-jvectormap-1.2.2.css', 
		'../theme-assets/plugins/daterangepicker/daterangepicker.css',
		'../theme-assets/plugins/datepicker/datepicker3.css',
		'../theme-assets/plugins/iCheck/all.css',
		'../theme-assets/plugins/colorpicker/bootstrap-colorpicker.min.css',
		'../theme-assets/plugins/timepicker/bootstrap-timepicker.min.css',
		'../theme-assets/plugins/select2/select2.min.css',
		'../theme-assets/plugins/fullcalendar/fullcalendar.min.css',
		'../theme-assets/react-treeview.css',
		'../theme-assets/plugins/pace/pace.min.css',
		'../theme-assets/dist/css/AdminLTE.min.css',						// AdminLTE
		'../theme-assets/dist/css/skins/_all-skins.min.css' 		// AdminLTE
	];
 
var uglified = uglifycss.processFiles(
    plugins,
    { maxLineLen: 500, expandVars: true }
);

/**
 * Save File
 */
var saveFile = function(blob, name, path, encoding) {
		//var fs = __meteor_bootstrap__.require('fs');
		var path = cleanPath(path),
			name = cleanName(name || 'file'), encoding = encoding || 'binary',
			
		// Clean up the path. Remove any initial and final '/' -we prefix them-,
		// any sort of attempt to go to the parent directory '..' and any empty directories in
		// between '/////' - which may happen after removing '..'
		path = './';
		
		// TODO Add file existance checks, etc...
		fs.writeFile(path + name, blob, encoding, function(err) {
			console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
		}); 

		function cleanPath(str) {
			if (str) {
				return str.replace(/\.\./g,'').replace(/\/+/g,'').
					replace(/^\/+/,'').replace(/\/+$/,'');
			}
		}
		function cleanName(str) {
			return str.replace(/\.\./g,'').replace(/\//g,'');
		}
}

//console.log(uglified);

saveFile( uglified, 'plugins.min.css' );