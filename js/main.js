var x = '';
var c = '';
var b = '';
var a = '';


$(document).ready(function() {
	if(isAPIAvailable()) {
		$('#files').bind('change', handleFileSelect);
	}

	document.getElementById("generate").addEventListener("click", function(){
	alert("alert");
	var html = x+c+b+a;
	$('#contents').html(html);
	});

});



function isAPIAvailable() {
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  // Great success! All the File APIs are supported.
	  return true;
	} else {
	  // source: File API availability - http://caniuse.com/#feat=fileapi
	  // source: <output> availability - http://html5doctor.com/the-output-element/
	  document.writeln('The HTML5 APIs used in this form are only available in the following browsers:<br />');
	  // 6.0 File API & 13.0 <output>
	  document.writeln(' - Google Chrome: 13.0 or later<br />');
	  // 3.6 File API & 6.0 <output>
	  document.writeln(' - Mozilla Firefox: 6.0 or later<br />');
	  // 10.0 File API & 10.0 <output>
	  document.writeln(' - Internet Explorer: Not supported (partial support expected in 10.0)<br />');
	  // ? File API & 5.1 <output>
	  document.writeln(' - Safari: Not supported<br />');
	  // ? File API & 9.2 <output>
	  document.writeln(' - Opera: Not supported');
	  return false;
	}
}

function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object
	var file = files[0];

	// read the file metadata
	var output = ''
	output += '<span style="font-weight:bold;">' + escape(file.name) + '</span><br />\n';
	output += ' - FileType: ' + (file.type || 'n/a') + '<br />\n';
	output += ' - FileSize: ' + file.size + ' bytes<br />\n';
	output += ' - LastModified: ' + (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a') + '<br />\n';

	// read the file contents
	printTable(file);

	// post the results
	$('#list').append(output);
}

function printTable(file) {
	var reader = new FileReader();
	reader.readAsText(file);
	reader.onload = function(event){
		var csv = event.target.result;
		var data = $.csv.toObjects(csv);

		x = '';
		c = '';
		b = '';
		a = '';
		for(var row in data) {
			if(data[row].Grade == "X") {
				x += '<tr>\r\n';
				for(var item in data[row]) {
					x += '<td>' + data[row][item] + '</td>\r\n';
				}
				x += '</tr>\r\n';
			} else if (data[row].Grade == "C") {
				c += '<tr>\r\n';
				for(var item in data[row]) {
					c += '<td>' + data[row][item] + '</td>\r\n';
				}
				c += '</tr>\r\n';
			} else if (data[row].Grade == "B") {
				b += '<tr>\r\n';
				for(var item in data[row]) {
					b += '<td>' + data[row][item] + '</td>\r\n';
				}
				b += '</tr>\r\n';
			} else if (data[row].Grade == "A") {
				a += '<tr>\r\n';
				for(var item in data[row]) {
					a += '<td>' + data[row][item] + '</td>\r\n';
				}
				a += '</tr>\r\n';
			}
		}
	};


	reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
}

  