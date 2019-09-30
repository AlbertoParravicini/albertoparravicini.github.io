let yspacing = 10; // Distance between each vertical location
let theta = 0.0; // Start angle at 0
let amplitude = 25.0; // Width of wave
let period = 500.0; // How many pixels before the wave repeats
let dy; // Value for incrementing y
let xvalues; // Using an array to store width values for the wave

let line_height; // Effective length of the line;
let heigth_offset = 120; // How much shorter the line is w.r.t. the canvas;

let radius_1 = 20;
let radius_2 = 30;

function setup() {
  frameRate(30);
	var canvasDiv = document.getElementById('drawing-box');
	var width = canvasDiv.offsetWidth;
  var height = canvasDiv.offsetHeight;
	line_height = height - heigth_offset;
	var canvas = createCanvas(width, height);
	canvas.parent('drawing-canvas');

		background(255, 255, 255);
			computeWave();
			renderWave();
}

function windowResized() {
	var canvasDiv = document.getElementById('drawing-box');
	var width = canvasDiv.offsetWidth;
  var height = canvasDiv.offsetHeight;
  
  line_height = height - heigth_offset;
		resizeCanvas(width, height);

		background(255, 255, 255);
			computeWave();
			renderWave();
}

function draw() {
	background(255, 255, 255);
  renderWave();

  var y = floor(mouseY / yspacing);
  y = min(y, xvalues.length - 1);
  y = max(0, y);
	drawCircle(
    width / 2 + xvalues[y],
    heigth_offset / 2 + y * yspacing,
    radius_1
    );
	drawCircle(
    width / 2 + xvalues[y],
    heigth_offset / 2 + y * yspacing,
    radius_2
    );
}

function computeWave() {
	amplitude = width / 5;
	radius_1 = max(width / 9, 10);
	radius_2 = max(width / 12, 7);
	dy = (TWO_PI / period) * yspacing;
		xvalues = new Array(floor(line_height / yspacing));
		calcWave();
}

function calcWave() {
	// For every y value, calculate a x value with sine function
	let y = theta;
	for (let i = 0; i < xvalues.length; i++) {
		xvalues[i] = sin(y) * amplitude;
		y += dy;
	}
}

function renderWave() {
	stroke(30, 30, 30);
	for (let y = 0; y < xvalues.length - 1; y=y+2) {
		line(width / 2 + xvalues[y],
			heigth_offset / 2 + y * yspacing,
			width / 2 + xvalues[y + 1],
			heigth_offset / 2 + (y + 1) * yspacing);
	}
}


function drawCircle(x, y, radius) {
	N = 50;
	values = new Array(N);

	for (let i = 0; i < values.length; i++) {
		values[i] = [cos(i * TWO_PI / N) * radius, sin(i * TWO_PI / N) * radius]
	}
	for (let i = 0; i < values.length - 1; i = i + 2) {
		line(x + values[i][0], y + values[i][1], x + values[i + 1][0], y + values[i + 1][1])
	}
}
