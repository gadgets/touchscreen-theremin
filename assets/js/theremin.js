$(function(){

    var prefix =    'orientation' in screen ? '' :
                    'mozOrientation' in screen ? 'moz' :
                    'msOrientation' in screen ? 'ms' :
                    null;

    theremin = new Theremin();
    theremin.start();
	
	$(".type-trigger").click(function() {
		var type = $(this).data('type')
		theremin.oscillator.type = type;
    });

});


function Theremin() {
	var self = this;

    self.context = new AudioContext(); //webkit browsers only
	self.oscillator = this.context.createOscillator();
    self.level = this.context.createGain();
    self.playing = false;
	self.screen_width = $( document ).width();

    self.oscillator.type = 'sine'; // sine wave
    self.oscillator.frequency.value = 440;
    self.oscillator.start(0);
    self.level.gain.value = 0;
	
	self.oscillator.connect(self.level);
	self.level.connect(self.context.destination);
	
};

Theremin.prototype.oscillator = null;
Theremin.prototype.playing = null;
Theremin.prototype.level = null;
Theremin.prototype.lastLevel = 0;
Theremin.prototype.lastY = 0;
Theremin.prototype.tremolo = false;
Theremin.prototype.screenWidth = 0;
Theremin.prototype.canvas = null;
Theremin.prototype.tuna = null;
Theremin.prototype.effects = {};
Theremin.prototype.context = 0;
Theremin.prototype.message = {};


Theremin.prototype.start = function() {

    var self = this;

    self.canvas = document.getElementById('canvas');
	self.context = canvas.getContext('2d');

	self.canvas.addEventListener('mousemove', function(evt) {
		evt.preventDefault();
		var mousePos = self.getMousePos(evt);
		self.writeIt(mousePos);
		self.posCalcultion(mousePos);
	}, false);

	self.canvas.addEventListener("touchmove", function(evt) {
		evt.preventDefault();
		var touchPos = self.getTouchPos(evt);
		self.writeIt(touchPos);
		self.posCalcultion(touchPos);
	}, false);
	
	self.canvas.addEventListener('touchstart', function(evt) {
		evt.preventDefault();
		self.play(function() {
			var touchPos = self.getTouchPos(evt);
			self.writeIt(touchPos);
			self.posCalcultion(touchPos);
		});
	}, false);
	
	self.canvas.addEventListener('touchend', function(evt) {
		evt.preventDefault();
		self.stop();
	}, false);

	self.canvas.addEventListener('mousedown', function(evt) {
		evt.preventDefault();
		self.play(function(){
			var mousePos = self.getMousePos(evt);
			self.writeIt(mousePos);
			self.posCalcultion(mousePos);
		});
	}, false);
	
	self.canvas.addEventListener('mouseup', function(evt) {
		evt.preventDefault();
		self.stop();
	}, false);
	
};

Theremin.prototype.play = function(callback) {

    var self = this;

    self.playing = true;
    if (self.lastLevel == 0){
        self.lastLevel = .5;
    }
    self.level.gain.value = self.lastLevel;
	
	if (typeof callback === "function") {
		callback();
	}
	
}


Theremin.prototype.stop = function() {
    var self = this;
    self.playing = false;
    self.level.gain.value = 0;
	return true;
}


Theremin.prototype.writeMessage = function() {
	var self = this;
	
	var text = "Mouse = X:" + self.message.posx + " Y:" + self.message.posy;
	
	if ( ("freq" in self.message) ) {
		text += " | Frequency: " + self.message.freq;
	}
	
	self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
	self.context.font = '18pt Calibri';
	self.context.fillStyle = 'black';
	self.context.fillText(text, 10, 25);
	return true;
}


Theremin.prototype.writeIt = function(mousePos) {
	var self = this;
	self.message. posx = mousePos.x;
	self.message.posy = mousePos.y;
	self.writeMessage();
	return true;
}


Theremin.prototype.getMousePos = function(evt) {
	var self = this;
	var rect = self.canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}


Theremin.prototype.getTouchPos = function(evt) {
	var self = this;
	var rect = self.canvas.getBoundingClientRect();
	return {
		x: evt.touches[0].clientX - rect.left,
		y: evt.touches[0].clientY - rect.top
	};
}


Theremin.prototype.posCalcultion = function (mousePos) {
	theremin.frequencyConstraint(mousePos.x);
}

Theremin.prototype.setGain = function (mousePos) {
	var percent = (theremin.lastY/$(document).height()) * 100;
	var new_gain = ((100 - Math.round(percent)) * .01);
	theremin.level.gain.value = new_gain;
	theremin.lastLevel = new_gain;
	theremin.lastY = y;
}


Theremin.prototype.setFrequency = function(value) {
	var self = this;
	if (theremin.playing == true) {
        theremin.frequencyConstraint(value);
    }
}

Theremin.prototype.frequencyConstraint = function(event_x) {
	var self = this;
	
    var high_b = 493.9;
    var low_c = 65.41;
    var range = high_b - low_c;

	var percentageX = (event_x/self.canvas.width) * 100;
    var freq = (range * (percentageX/100) + low_c);
	
	if (self.tremolo == true) {
		
		min = freq - 3;
		max = freq + 3;
		freq = Math.random() * (max - min) + min;
		
	}
	
    self.oscillator.frequency.value = freq;
	self.message.freq = freq;

};

Theremin.prototype.addEffect = function() {
    return 1;

}


Theremin.prototype.frequencyList = {
    32.70: "C1"
}
/*    {
        freq: 34.65,
        name: "C#1"
    },
    {
        freq: 36.71,
        name: "D1"
    },
    {
        freq: 38.89,
        name: "D#1/Eb1"
    },
    {
        freq: 41.20,
        name: "E1"
    },
    {
        freq: 43.65,
        name: "F1"
    },
    {
    	freq: 46.25,
        name: "F#1/Gb1"
    },
    {
    	freq: 49.00,
        name: "G1"
    },
    {
    	freq: 51.91,
        name: "G#1/Ab1"
    },
    {
    	freq: 55.00,
        name: "A1"
    },
    {
    	freq: 58.27,
        name: "A#1/Bb1"
    },
    {
    	freq: 61.74,
        name: "B1"
    },
    {
    	freq: 65.41,
        name: "C2"
    }.
    {
    	freq: 69.30,
        name: "C#2/Db2"
    },
    {
    	freq: 73.42,
        name: "D2"
    },
    {
    	frew: 77.78,
        name: "D#2/Eb2"
    },
    {
    	frew: 82.41,
        name: "E2"
    },
    {
    	freq: 87.31,
        name: "F2"
    },
    {
    	freq: 92.50,
        name: "F#2/Gb2"
    },
    {
    	freq: 98.00,
        name: "G2"
    },
    {
    	freq: 103.83,
        name: "G#2/Ab2"
    },
    {
    	freq: 110.00,
        name: "A2"
    },
    {
    	freq: 116.54,
        name: "A#2/Bb2"
    },
    {
    	freq: 123.47,
        name: "B2"
    },
    {
    	freq: 130.81,
        name: "C3"
    },
    {
    	freq: 138.59,
        name: "C#3/Db3"
    },
    {
    	freq: 146.83,
        name: "D3"
    },
    {
    	freq: 155.56,
		name: "D#3/Eb3"
	}.
    {
    	freq: 164.81,
		name: "E3",
    }.
    {
    	freq: 174.61,
		name: "F3"
    }.
    {
    	freq: 185.00,
		name: "F#3/Gb3"
    }.
    {
    	freq: 196.00,
	name: "G3"
    },
    {
    	freq: 207.65,
		name: "G#3/Ab3"
    },
    {
    	freq: 220.00,
	name: "A3"
    },
    {
    	freq: 233.08,
	name: "A#3/Bb3"
    },
    {
    	freq: 246.94,
	name: "B3"
    },
    {
    	freq: 261.63,
	name: "C4"
    },
    {
    	freq: 277.18,
		name: "C#4/Db4"
    }.
    {
    	freq: 293.66,
	name: "D4"
    },
    {
    	freq: 311.13,
	name: "D#4/Eb4"
    },
    {
    	freq: 329.63,
	name: "E4"
    },
    {
    	freq: 349.23,
	name: "F4"
    },
    {
    	freq: 369.99,
	name: "F#4/Gb4"
    },
    {
    	freq: "392.00",
	name: "G4"
    },
    {
    	freq: 415.30,
		name: "G#4/Ab4"
    },
    {
    	freq: 440.00,
		name: "A4"
    },
    {
    	freq: 466.16,
		name: "A#4/Bb4"
    },
    {
    	freq: 493.88,
		name: "B4"
    }
];*/
