var x = '';
var c = '';
var b = '';
var a = '';


$(document).ready(function() {
	document.getElementById("lab_issues").addEventListener("click", function(){

		document.getElementById('inputs').innerHTML = '<input type=file id="files" name=files[] multiple /><button id="generate">generate</button>';

		if(isAPIAvailable()) {
			$('#files').bind('change', handleFileSelect);
		}

		document.getElementById("generate").addEventListener("click", function(){
			var html = x+c+b+a;
			document.getElementById('inputs').innerHTML = '<table id="contents" border></table>';
			$('#contents').html(html);
		});

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

			var points = 0;
			var commentary = "";
			var oilConsumption = data[row].oiladded/data[row].oilhours;
			commentary += "Oil Consumption at " + Math.round(oilConsumption * 100) / 100 + "l/Hr. ";
			if(data[row].NIT >= 11 && data[row].SUL >=24) {
				points += 1;
				commentary += " Nitration and sulphur are high which can be caused by engine combustion blow-by; cooling system temperatures outside recommended specifications during some operating conditions; engine lugging; or insufficient engine rundown prior to hot shut downs.";
			}
			if(data[row].Fe >= 10) {
				points += 1;
				commentary += ' Iron is high.';
			}
			if(data[row].Cu >= 12) {
				points += 1;
				commentary += ' Copper is high. Check filter media and screen for wear particles.';
			}
			if(data[row].H20 >= 1) {
				commentary += ' Sample is contaminated by water.';
			}
			if(data[row].Pb >= 4 && data[row].Pb <10) {
				points += 1;
				commentary += ' Lead is high. Check filter media and screen for wear particles.';
			}
			if(data[row].Pb >= 10) {
				points += 2;
				commentary += ' Lead is very high. Check filter media and screen for wear particles.';
			}
			if(data[row].TBN <= 5) {
				points += 1;
				commentary += ' Oil is deteriorating.';
			}
			if(data[row].oilhours > 500) {
				points += 1;
				commentary += ' Oil service interval should not exceed 500 hours.';
			}
			if(data[row].ST >= 19) {
				points += 1;
				commentary += ' Check dusty/restricted air filter elements.';
			}
			if(data[row].Mo >= 4) {
				points += 1;
				commentary += ' The molybendium may indicate coolant entry.';
			}
			if(data[row].Na >= 9) {
				points += 1;
				commentary += ' The sodium may indicate coolant entry. The sodium may indicate washdown/external water entry. Check the seals; breathers and fill point for water entry points.';
			}
			if(data[row].K >= 20) {
				points += 1;
				commentary += ' The potassium may indicate coolant entry.';
			}
			if(data[row].oiladded >= 71) {
				points += 1;
				commentary += ' The quantity of oil added may cause less wear to be indicated.';
			}
			if(data[row].PQI >= 11) {
				points += 1;
				commentary += ' The PQ index is high. Fine ferrous metal particles visible in this sample.';
			}
			if(data[row].V40 >= 130) {
				points += 1;
				commentary += ' The viscosity levels are elevated. This can be from incorrect operating procedures / temperatures or combustion blowby. Investigate the cause and resample to confirm the effectiveness of any adjustments or repairs.';
			}

			if(points > 2) {
				commentary += ' For enquiries regarding this evaluation, please contact (07) 3219 0000.';
				x += '<tr>\r\n' + '<td>X</td>\r\n'+ '<td>' + commentary + '</td>\r\n';
				x += '<td>' + data[row].serialno + '</td>\r\n';
				x += '</tr>\r\n';
			} else if (points == 2) {
				commentary += ' For enquiries regarding this evaluation, please contact (07) 3219 0000.';
				c += '<tr>\r\n' + '<td>C</td>\r\n' + '<td>' + commentary + '</td>\r\n';
				c += '<td>' + data[row].serialno + '</td>\r\n';
				c += '</tr>\r\n';
			} else if (points == 1) {
				commentary += ' For enquiries regarding this evaluation, please contact (07) 3219 0000.';
				b += '<tr>\r\n' + '<td>B</td>\r\n' + '<td>' + commentary + '</td>\r\n';
				b += '<td>' + data[row].serialno + '</td>\r\n';
				b += '</tr>\r\n';
			} else if (points == 0) {
				commentary += 'All test results appear normal. Continue to sample at consistent intervals.';
				commentary += ' For enquiries regarding this evaluation, please contact (07) 3219 0000.';
				a += '<tr>\r\n' + '<td>A</td>\r\n' + '<td>' + commentary + '</td>\r\n';
				a += '<td>' + data[row].serialno + '</td>\r\n';
				a += '</tr>\r\n';
			}
		}
	};


	reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
}

  