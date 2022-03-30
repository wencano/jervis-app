/**
 * Number Prototype
 */
Number.prototype.pad = function() {
	var number = this.valueOf();
	if (number < 10) {
		return '0' + number;
	}
	return number;
}

Number.prototype.addCommas = function() {
  var n = this.valueOf().toString();
  while (true) {
    var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3');
    if (n == n2) break;
    n = n2;
  }
  return n;
}

Number.prototype.accounting = function( parenthesis ) {
  var value = parseFloat( this.valueOf() );
	var value2 = value; 
	
	if( parenthesis && value < 0 ) {
		value2 = value * (-1);
	}
	
	var n = value2.toFixed(2);
  while (true) {
    var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3');
    if (n == n2) break;
    n = n2;
  }
	
  return (parenthesis && value < 0) ? "(" + n + ")" : n;
}

Number.prototype.toFloat = function(){
	return parseFloat( this.valueOf() ) || 0;
}




/**
 * String Prototypes
 */
// Capitalize First Letter
String.prototype.ucwords = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.capitalize = function(){
	return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
};

// String Replace All
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.initials = function() {
	let str = (this).trim();
	str = str.replace(/\s\s+/g, ' ');
	return str != '' ? str.split(" ").map(function(item){ return item[0].toUpperCase(); }).join("") : "";
}

String.prototype.toFloat = function(){
	return parseFloat( (this).replace(/,/g, '')) || 0;
}

String.prototype.noSlash = function() {
	let str = this;
	if(str.substr(-1) === '/') {
			return str.substr(0, str.length - 1);
	}
	return str;
}

String.prototype.slugify = function () {
	let str = this; 
  return str.toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

String.prototype.nl2br = function() {
	let str = this;
	return str.replaceAll( "\n", "<br />");
}



/**
 * Array Prototypes
 */
// Array Prototype alpha
Array.prototype.alphanumSort = function(caseInsensitive) {
	for (var z = 0, t; t = this[z]; z++) {
		this[z] = [];
		var x = 0, y = -1, n = 0, i, j;

		while (i = (j = t.charAt(x++)).charCodeAt(0)) {
			var m = (i == 46 || (i >=48 && i <= 57));
			if (m !== n) {
				this[z][++y] = "";
				n = m;
			}
			this[z][y] += j;
		}
	}

	this.sort(function(a, b) {
		for (var x = 0, aa, bb; (aa = a[x]) && (bb = b[x]); x++) {
			if (caseInsensitive) {
				aa = aa.toLowerCase();
				bb = bb.toLowerCase();
			}
			if (aa !== bb) {
				var c = Number(aa), d = Number(bb);
				if (c == aa && d == bb) {
					return c - d;
				} else return (aa > bb) ? 1 : -1;
			}
		}
		return a.length - b.length;
	});

	for (var z = 0; z < this.length; z++)
		this[z] = this[z].join("");
}

// Multi sort
Array.prototype.multisort = function(columns) {
  var arr = this;
  arr.sort(function(a, b) {
    return compare(a, b, 0);
  });

  function compare(a, b, colindex) {
    if (colindex >= columns.length) return 0;

    var columnname = columns[colindex];
    var a_field1 = a[columnname];
    var b_field1 = b[columnname];
    var asc = (colindex % 2 === 0);

    if (a_field1 < b_field1) return asc ? -1 : 1;
    else if (a_field1 > b_field1) return asc ? 1 : -1;
    else return compare(a, b, colindex + 1);
  }
}


Array.prototype.natsort = function(col) {
	this.sort((a,b)=>{
		let result = naturalSort(a, b, col);
		return result !== 0 ? result : 0;
	});
}


Array.prototype.last = function() {
	return this[this.length - 1];
}

Array.prototype.inArray = function(item) {
	return this.indexOf(item) > -1;
}


/**
 * Date Prototype
 */
// To ISODate Format (yyyy-mm-dd)
if (!Date.prototype.toISODate) {
  (function() {

    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }

    Date.prototype.toISODate = function() {
      return this.getUTCFullYear() +
        '-' + pad(this.getUTCMonth() + 1) +
        '-' + pad(this.getUTCDate());
    };

  }());
}

// To Month/Date
if (!Date.prototype.toMonthDate) {
  (function() {

    Date.prototype.toMonthDate = function() {
      return (this.getUTCMonth() + 1) + "/" + this.getUTCDate();
    };

  }());
}



// Config
Config.months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

// Global App
this.App = {};
App.today = new Date();
App.eventsThread = null;
App.eventThread = null;


/**
 * Custom Functions
 */

 /**
 * Get Start of the Week
 */
function getFirstDOW(d) {
	d = new Date(d);
	var day = d.getDay(),
			diff = d.getDate() - (1+day) + (day == 0 ? -6:1); // adjust when day is sunday
	return new Date(d.setDate(diff));
}

/**
 * Get Last day of the Week
 */
function getLastDOW(d) {
	d = new Date(d);
	var day = d.getDay(),
			diff = d.getDate() + ( 6 - day ) + (day == 6 ? 6:0); // adjust when day is sunday
	return new Date(d.setDate(diff));
}


/**
 * Convert Time
 */
function toHHMM(t) {
	return ( ("0" + Math.floor( t/60 ) ).substr(-2) + ":" + ( "0" + (t%60)).substr(-2) ); 
}


// Slugify Function
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}


/**
 * Natural Sort
 */
var NUMBER_GROUPS = /(-?\d*\.?\d+)/g;
var naturalSort = function (a, b, columnname) {
  var a_field1 = a[columnname],
      b_field1 = b[columnname],
      aa = String(a_field1).split(NUMBER_GROUPS),
      bb = String(b_field1).split(NUMBER_GROUPS),
      min = Math.min(aa.length, bb.length);

  for (var i = 0; i < min; i++) {
    var x = parseFloat(aa[i]) || aa[i].toLowerCase(),
        y = parseFloat(bb[i]) || bb[i].toLowerCase();
    if (x < y) return -1;
    else if (x > y) return 1;
  }

  return 0;
};


function split( val ) {
	return val.split( /,\s*/ );
}
function extractLast( term ) {
	return split( term ).pop();
}


/**
 * App Helpers
 */
var AppHelpers = {};


// Get Bootstrap Width
AppHelpers.screenIs = function( alias ) {
  return $('.device-' + alias).is(':visible');
}

AppHelpers.getScreen = function() {
	
	if( AppHelpers.screenIs('xs') ) return 'xs';
	else if ( AppHelpers.screenIs('sm') ) return 'sm';
	else if ( AppHelpers.screenIs('md') ) return 'md';
	else if ( AppHelpers.screenIs('lg') ) return 'lg'; 
	
}


// Final Event Listener
AppHelpers.waitForFinalEvent = function () {
	var b = {};
	return function (c, d, a) {
		a || (a = "I am a banana!");
		b[a] && clearTimeout(b[a]);
		b[a] = setTimeout(c, d)
	}
}();

var fullDateString = new Date();

