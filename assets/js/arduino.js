var connection_id = -1;
var buffering = false;
var buffer_data_array = [];
var buffer_string_array = [];
var found_13 = false;
var found_10 = false;

var theremin = new Theremin();

function findArduino(ports) {
	var found_path = null;
	if (connection_id == -1) {
		
		_.each(ports, function(value, key, list){
			if (value.productId == 67 && value.vendorId == 9025) {
				found_path = value.path;
			}
		});
		
		if (found_path) {
			chrome.serial.connect(found_path, openPort);
		}
		
	}
}

function openPort(connection){
	connection_id = connection.connectionId;
	chrome.serial.onReceive.addListener(readPort);
	// start the theremin
	theremin.start();
}

function readPort(port_data) {
	
	if (port_data != null) {
		buffer_data_array.push(port_data.data);
	}
	
	if (buffering == false) {
		buffering = true;
		var data_items = buffer_data_array[0];
		var data_array = new Uint8Array(data_items).forEach(function(element, index, array) {
			if (element == 13) {
				found_13 = true;
			}
			if (element == 10) {
				found_10 = true;
			}
			buffer_string_array.push(element)
		});
		
		if (found_10 == true && found_13 == true) {
			read_buffer = String.fromCharCode.apply(null, buffer_string_array);
			theremin.setFrequency(read_buffer);
			buffer_string_array = [];
			found_10 = false;
			found_13 = false;
		}
		
		buffer_data_array.shift();
		buffering = false;
		
		if (buffer_data_array.lenght > 0) {
			// go again
			readPort(null);
		}

	}
	
}

onload = function() {
	chrome.serial.getDevices(function(ports) {
		console.log(ports);
		findArduino(ports);
	});
};
