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

let circle_angle_offset = 0; // Used to animate the rotation of the circle;

let emit_particles_frames = 50;
let curr_emit_particles = 0;
let particles_angles = [];
let particles_num = 40;
let particles_pos = [];
let particles_mov = 2; // Movement of each particle in each frame;
let emit = false;
let particle_color = []; // Color of each particle;
let particle_starts = []; // Starting frame of each particle;

let circlesmall = [];
let circlesmallx;
let circlesmally;

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
      circlesmallx = width / 2 + xvalues[xvalues.length - 1];
      circlesmally = heigth_offset / 2 + (xvalues.length - 1) * yspacing
    	circle_small = computeCircle(
        circlesmallx,
        circlesmally,
        radius_2
        );
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
      circlesmallx = width / 2 + xvalues[xvalues.length - 1];
      circlesmally = heigth_offset / 2 + (xvalues.length - 1) * yspacing
    	circle_small = computeCircle(
        circlesmallx,
        circlesmally,
        radius_2
        );
}

function draw() {
  stroke(30, 30, 30);
	background(255, 255, 255);
  renderWave();

  circle_angle_offset += 0.02

  var y = floor(mouseY / yspacing);
  y = min(y, xvalues.length - 1);
  y = max(0, y);
  var circle_big = computeCircle(
    width / 2 + xvalues[y],
    heigth_offset / 2 + y * yspacing,
    radius_1
    );
  drawCircle(circle_big);
	drawCircle(circle_small);

  // We emit particles if the circles match;
  if (y < xvalues.length - 1) {
    emit = true;
  } 

  // Reset the emission;
  if (emit && (curr_emit_particles == 0) && (y == xvalues.length - 1)) {
    curr_emit_particles = emit_particles_frames;
    emit = false;
    // Create some random angles;
    for (let p = 0; p < particles_num; p++) {
      angle = TWO_PI * Math.random();
      particles_angles[p] = [cos(angle), sin(angle)]
      particles_pos[p] = 0;
      particle_color[p] = [floor(Math.random() * 255), floor(Math.random() * 255), floor(Math.random() * 255), floor(Math.random() * 255)]
      particle_starts[p] = floor(Math.random() * emit_particles_frames / 2);
    }
  } 
  // Perform an emission step;
  if (curr_emit_particles > 0) {
    // Move the particles;
    for (let p = 0; p < particles_num; p++) {
      // Delay the start of some particles;
      if (emit_particles_frames - curr_emit_particles < particle_starts[p]) {
        continue;
      }

      strokeWeight(4);
      stroke(particle_color[p][0],
        particle_color[p][1],
        particle_color[p][2],
        particle_color[p][3] * (curr_emit_particles / emit_particles_frames));
      c = particles_angles[p][0];
      s = particles_angles[p][1];
      p_x_new = c * (particles_pos[p] + particles_mov);
      p_y_new = s * (particles_pos[p] + particles_mov);
      p_x_start = c * (particles_pos[p] - 3 * particles_mov);
      p_y_start = s * (particles_pos[p] - 3 * particles_mov);
      line(
        p_x_start + circlesmallx,
        p_y_start + circlesmally,
        p_x_new + circlesmallx,
        p_y_new + circlesmally
      )
      particles_pos[p] += particles_mov;
    }
    curr_emit_particles--;
    strokeWeight(1);
    stroke(30, 30, 30);
  }
}

function computeWave() {
	amplitude = width / 5;
	radius_1 = max(width / 9, 12);
	radius_2 = max(width / 14, 7);
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


function computeCircle(x, y, radius) {
  N = 50;
	values = new Array(N);

	for (let i = 0; i < values.length; i++) {
		values[i] = [x + cos(i * TWO_PI / N + circle_angle_offset) * radius, y + sin(i * TWO_PI / N + circle_angle_offset) * radius]
  }
  return values;
}

function drawCircle(values) {
	for (let i = 0; i < values.length - 1; i = i + 2) {
		line(values[i][0], values[i][1], values[i + 1][0], values[i + 1][1])
	}
}
