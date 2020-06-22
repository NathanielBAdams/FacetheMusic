let privacy = document.querySelector('#privacy');
let vocalGuitar = document.querySelector('.guitar');
let vocalBass = document.querySelector('.bass');
let beatbox = document.querySelector('.drums');
let instruments = document.querySelectorAll('.instrument-buttons');
let faceLocation;
let ULplaying = false;
let URplaying = false;
let LLplaying = false;
let LRplaying = false;
let startBtn = document.getElementsByClassName('startBtn');
let muteButtons = document.getElementsByClassName('muteButtons');

// once the user starts up the webcam, hide the buttons and start the groove
hideButtonsStartGroove = function() {
	for (let i of startBtn) {
		i.style.display = 'none';
	}
	for (let i of muteButtons) {
		i.style.display = 'block';
	}
	// start the groove
	bass.play('main');
	drums.play('main');
	guitar.play('main');
};

// enable the mute buttons visually
for (let i of instruments) {
	i.addEventListener('click', function() {
		i.classList.toggle('muted');
		i.classList.toggle('btn-secondary');
	});
}

// enable the mute button's functions
vocalGuitar.addEventListener('click', function() {
	guitar.mute() ? guitar.mute(false) : guitar.mute(true);
});

vocalBass.addEventListener('click', function() {
	bass.mute() ? bass.mute(false) : bass.mute(true);
});

beatbox.addEventListener('click', function() {
	drums.mute() ? drums.mute(false) : drums.mute(true);
});

// privacy info
privacy.addEventListener('click', function() {
	privacy.style.display = 'block';
	privacy.textContent = 'All the processing is done on the client side, i.e., without sending images to a server.';
});

// Each frame, the canvas is refilled. This function is called each time before face processing starts.
// it draws elements on top of the canvas, so they appear in front of the webcam feed.

function canvasOverlays(ctx) {
	ctx.shadowColor = 'whitesmoke';
	ctx.shadowBlur = 15;
	ctx.lineWidth = 0.1;
	ctx.fillStyle = '#F0C3B915';
	fillUpperLeft(ctx);
	fillUpperRight(ctx);
	fillLowerRight(ctx);
	fillLowerLeft(ctx);
}

function fillUpperLeft(ctx) {
	if ((faceLocation = 'upperLeft' && ULplaying === true)) {
		ctx.save();
		ctx.fillStyle = '#1D32DF35';
		ctx.strokeRect(20, 20, 200, 150);
		ctx.fillRect(20, 20, 200, 150);
		ctx.restore();
	} else {
		ctx.strokeRect(20, 20, 200, 150);
		ctx.fillRect(20, 20, 200, 150);
	}
}

function fillUpperRight(ctx) {
	if ((faceLocation = 'upperRight' && URplaying === true)) {
		ctx.save();
		ctx.fillStyle = '#DC1DDF35';
		ctx.strokeRect(410, 20, 200, 150);
		ctx.fillRect(410, 20, 200, 150);
		ctx.restore();
	} else {
		ctx.strokeRect(410, 20, 200, 150);
		ctx.fillRect(410, 20, 200, 150);
	}
}

function fillLowerRight(ctx) {
	if ((faceLocation = 'lowerRight' && LRplaying === true)) {
		ctx.save();
		ctx.fillStyle = '#DF401D35';
		ctx.strokeRect(410, 290, 200, 150);
		ctx.fillRect(410, 290, 200, 150);
		ctx.restore();
	} else {
		ctx.strokeRect(410, 290, 200, 150);
		ctx.fillRect(410, 290, 200, 150);
	}
}

function fillLowerLeft(ctx) {
	if ((faceLocation = 'lowerLeft' && LLplaying === true)) {
		ctx.save();
		ctx.fillStyle = '#1DDF4035';
		ctx.strokeRect(20, 290, 200, 150);
		ctx.fillRect(20, 290, 200, 150);
		ctx.restore();
	} else {
		ctx.strokeRect(20, 290, 200, 150);
		ctx.fillRect(20, 290, 200, 150);
	}
}

function soundCheck(ctx) {
	// pass thru the canvas element (ctx)
	// this function runs AFTER the detection check in the initial code.
	// Therefore a face has already been recognized.
	// check the quadrant that the face exists in.

	if (dets[0][0] > 240) {
		faceLocation = dets[0][1] > 320 ? 'lowerRight' : 'lowerLeft';
	} else {
		faceLocation = dets[0][1] > 320 ? 'upperRight' : 'upperLeft';
	}
	// Depending on where the face is, play the sound and animate connected to that quadrant
	playSound(faceLocation);
}

function playSound(faceLocation) {
	switch (faceLocation) {
		case 'upperLeft':
			if (ULplaying === false) {
				lick1.play('main');
			}
			break;
		case 'upperRight':
			if (URplaying === false) {
				lick2.play('main');
			}
			break;
		case 'lowerLeft':
			if (LLplaying === false) {
				lick3.play('main');
			}
			break;
		case 'lowerRight':
			if (LRplaying === false) {
				lick4.play('main');
			}
			break;
	}
}

// SOUND LIBRARY

let lick1 = new Howl({
	src: [ 'sounds/Lick1.wav' ],
	onplay: function() {
		ULplaying = true;
	},
	onend: function() {
		ULplaying = false;
	},
	sprite: {
		main: [ 500, 3200 ]
	}
});

let lick2 = new Howl({
	src: [ 'sounds/Lick2.wav' ],
	onplay: function() {
		URplaying = true;
	},
	onend: function() {
		URplaying = false;
	},
	sprite: {
		main: [ 500, 900 ]
	}
});

let lick3 = new Howl({
	src: [ 'sounds/Lick3.wav' ],
	onplay: function() {
		LLplaying = true;
	},
	onend: function() {
		LLplaying = false;
	},
	sprite: {
		main: [ 400, 1750 ]
	}
});

let lick4 = new Howl({
	src: [ 'sounds/Lick4.wav' ],
	onplay: function() {
		LRplaying = true;
	},
	onend: function() {
		LRplaying = false;
	},
	sprite: {
		main: [ 600, 2400 ]
	}
});

// groove loop sounds
let bass = new Howl({
	src: [ 'sounds/Bass.wav' ],
	loop: 1,
	mute: false,
	volume: 1,
	sprite: {
		main: [ 0, 9399, true ]
	}
});

let drums = new Howl({
	src: [ 'sounds/Beatbox.wav' ],
	loop: 1,
	mute: false,
	volume: 0.4,
	sprite: {
		main: [ 0, 9400, true ]
	}
});

let guitar = new Howl({
	src: [ 'sounds/Guitar.wav' ],
	loop: 1,
	mute: false,
	volume: 0.4,
	sprite: {
		main: [ 0, 9400, true ]
	}
});
