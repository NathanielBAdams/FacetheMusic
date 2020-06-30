let privacy = document.querySelector('#privacy');
let vocalGuitar = document.querySelector('.guitar');
let vocalBass = document.querySelector('.bass');
let beatbox = document.querySelector('.drums');
let instruments = document.querySelectorAll('.instrument-buttons');
let resetBtn = document.getElementsByClassName('reset');
let ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
let faceLocation;
let ULplaying = false;
let URplaying = false;
let LLplaying = false;
let LRplaying = false;
let bonusPlaying = false;
let startBtn = document.getElementsByClassName('startBtn');
let muteButtons = document.getElementsByClassName('muteButtons');
let images = document.getElementsByClassName('animatedGIFs');
let bonusClue = document.querySelector('.bonus-clue');
let lylaPic = document.querySelectorAll('.lyla-pic');

// once the user starts up the webcam, hide the buttons and start the groove
hideButtonsStartGroove = function() {
	for (let i of startBtn) {
		i.style.display = 'none';
	}
	for (let i of muteButtons) {
		i.style.display = 'block';
	}
	resetBtn[0].style.display = 'inline';
	// start the groove, scroll the user's screen so they can see the entire canvas
	bass.play('main');
	drums.play('main');
	guitar.play('main');
	window.scrollTo(0, 75);
	// display the bonus clue after 15 seconds
	setTimeout(function() {
		bonusClue.style.display = 'block';
	}, 15000);
};

// enable the mute buttons visually
for (let i of instruments) {
	i.addEventListener('click', function() {
		i.classList.toggle('muted');
		i.classList.toggle('btn-secondary');
	});
}

// enable the loop button's mute functions
vocalGuitar.addEventListener('click', function() {
	guitar.mute() ? guitar.mute(false) : guitar.mute(true);
});

vocalBass.addEventListener('click', function() {
	bass.mute() ? bass.mute(false) : bass.mute(true);
});

beatbox.addEventListener('click', function() {
	drums.mute() ? drums.mute(false) : drums.mute(true);
});

//enable the reset button functionality
resetBtn[0].addEventListener('click', function() {
	console.log('reset clicked');
	for (let i of instruments) {
		i.classList.remove('muted');
	}
	drums.stop();
	drums.mute(false);
	bass.stop();
	bass.mute(false);
	guitar.stop();
	guitar.mute(false);
	setTimeout(function() {
		drums.play('main');
		bass.play('main');
		guitar.play('main');
	}, 500);
});

// privacy info
privacy.addEventListener('click', function() {
	privacy.style.display = 'block';
	privacy.textContent = 'All the processing is done on the client side, i.e., without sending images to a server.';
});

// Each frame, the canvas is refilled. canvasOverlays is called each time before face processing starts.
// it draws elements on top of the canvas, so they appear in front of the webcam feed.

function canvasOverlays(ctx) {
	ctx.shadowColor = 'whitesmoke';
	ctx.shadowBlur = 15;
	ctx.lineWidth = 0.1;
	ctx.fillStyle = '#F0C3B915';
	if (bonusPlaying) {
		bonusAnimation(ctx);
	} else if (URplaying && ULplaying && LRplaying && LLplaying) {
		console.log('all four!');
		bonus.play('main');
	} else {
		fillUpperLeft(ctx);
		fillUpperRight(ctx);
		fillLowerRight(ctx);
		fillLowerLeft(ctx);
	}
}

function fillUpperRight(ctx) {
	if ((faceLocation = 'upperRight' && URplaying === true)) {
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

function fillUpperLeft(ctx) {
	if ((faceLocation = 'upperLeft' && ULplaying === true)) {
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

function fillLowerLeft(ctx) {
	if ((faceLocation = 'lowerLeft' && LLplaying === true)) {
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

function fillLowerRight(ctx) {
	if ((faceLocation = 'lowerRight' && LRplaying === true)) {
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

function faceLocator(ctx) {
	if (bonusPlaying) {
		return;
	}
	// pass thru the canvas element (ctx)
	// this function runs AFTER the detection check in the picoJS code.
	// Therefore a face has already been recognized.
	// check the quadrant that the face exists in.
	let x = dets[0][1];
	let y = dets[0][0];

	if (x < 240 && y < 200) {
		faceLocation = 'upperRight';
	}
	if (x < 240 && y > 240) {
		faceLocation = 'lowerRight';
	}
	if (x > 375 && y < 200) {
		faceLocation = 'upperLeft';
	}
	if (x > 375 && y > 240) {
		faceLocation = 'lowerLeft';
	}

	// Depending on where the face is, play the sound connected to that quadrant
	playSound(faceLocation);
	// console.log((x = ' - ' + y + ': ' + faceLocation));
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
		images[0].style.visibility = 'visible';
	},
	onmute: function() {
		ULplaying = false;
	},
	onend: function() {
		ULplaying = false;
		images[0].style.visibility = 'hidden';
	},
	sprite: {
		main: [ 500, 3000 ]
	}
});

let lick2 = new Howl({
	src: [ 'sounds/Lick2.wav' ],
	onplay: function() {
		URplaying = true;
		images[2].style.visibility = 'visible';
	},
	onmute: function() {
		URplaying = false;
	},
	onend: function() {
		URplaying = false;
		images[2].style.visibility = 'hidden';
	},
	sprite: {
		main: [ 500, 800 ]
	}
});

let lick3 = new Howl({
	src: [ 'sounds/Lick3.wav' ],
	onplay: function() {
		LLplaying = true;
		images[1].style.visibility = 'visible';
	},
	onmute: function() {
		LLplaying = false;
	},
	onend: function() {
		LLplaying = false;
		images[1].style.visibility = 'hidden';
	},
	sprite: {
		main: [ 400, 1650 ]
	}
});

let lick4 = new Howl({
	src: [ 'sounds/Lick4.wav' ],
	onplay: function() {
		LRplaying = true;
		images[3].style.visibility = 'visible';
	},
	onmute: function() {
		LRplaying = false;
	},
	onend: function() {
		LRplaying = false;
		images[3].style.visibility = 'hidden';
	},
	sprite: {
		main: [ 600, 2200 ]
	}
});

// groove loop sounds
let bass = new Howl({
	src: [ 'sounds/Bass.wav' ],
	loop: 1,
	mute: false,
	volume: 1,
	sprite: {
		main: [ 0, 9400, true ]
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
// bonus sound!
let bonus = new Howl({
	src: [ 'sounds/bonus.mp3' ],
	sprite: {
		main: [ 0, 6200 ]
	},
	onplay: function() {
		for (i of images) {
			i.style.visibility = 'visible';
		}
		muteAllSounds();
		bonusPlaying = true;
	},
	onend: function() {
		for (i of images) {
			i.style.visibility = 'hidden';
		}
		setTimeout(function() {
			unMuteAllSounds();
			bonusPlaying = false;
		}, 10);
	},
	mute: false,
	volume: 0.7
});

// bonus animation functions
muteAllSounds = () => {
	lylaPic[0].style.display = 'block';
	lylaPic[0].style.zIndex = '1';
	guitar.mute(true);
	bass.mute(true);
	drums.mute(true);
	lick1.mute(true);
	lick2.mute(true);
	lick3.mute(true);
	lick4.mute(true);
};

unMuteAllSounds = () => {
	lylaPic[0].style.display = 'none';
	lylaPic[0].style.zIndex = '-10';
	ctx.canvas.style.zIndex = '1';
	bass.mute(false);
	drums.mute(false);
	guitar.mute(false);
	lick1.mute(false);
	lick2.mute(false);
	lick3.mute(false);
	lick4.mute(false);
};

bonusAnimation = (ctx) => {
	ctx.save();

	ctx.fillStyle = randomColor();
	ctx.strokeRect(20, 20, 200, 150);
	ctx.fillRect(20, 20, 200, 150);

	ctx.fillStyle = randomColor();
	ctx.strokeRect(410, 20, 200, 150);
	ctx.fillRect(410, 20, 200, 150);

	ctx.fillStyle = randomColor();
	ctx.strokeRect(410, 290, 200, 150);
	ctx.fillRect(410, 290, 200, 150);

	ctx.fillStyle = randomColor();
	ctx.strokeRect(20, 290, 200, 150);
	ctx.fillRect(20, 290, 200, 150);

	ctx.restore();
};

function randomColor() {
	// pick a random rgba color
	let red = Math.floor(Math.random() * 256);
	let green = Math.floor(Math.random() * 256);
	let blue = Math.floor(Math.random() * 256);
	let trans = Math.random();
	let randomColor = 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + trans + ')';
	return randomColor;
}
