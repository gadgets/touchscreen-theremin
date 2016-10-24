$(function(){

    var prefix =    'orientation' in screen ? '' :
                    'mozOrientation' in screen ? 'moz' :
                    'msOrientation' in screen ? 'ms' :
                    null;

	canvas = document.getElementById('canvas');
	
	canvas.addEventListener('mousemove', function(evt) {
		evt.preventDefault();
		
		console.log(evt);
		console.log(evt.offsetX);
		
		var rect = canvas.getBoundingClientRect();
		
		
	}, false);

});
