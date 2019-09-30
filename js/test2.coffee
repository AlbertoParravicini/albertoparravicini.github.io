drawing_demo = (p_o) ->

	yspacing = 10 # Distance between each vertical location
	h = 0 # Height of entire wave
	theta = 0.0; # Start angle at 0
	amplitude = 75.0; # Width of wave
	period = 500.0; # How many pixels before the wave repeats
	dy = 0 # Value for incrementing y
	xvalues = [] # Using an array to store height values for the wave

	calcWave = () ->
        theta += 0.02

        # For every x value, calculate a y value with sine function
        y = theta
        for i in [0..xvalues.length]
            xvalues[i] = p_o.sin(y) * amplitude
            y += dy

    renderWave = () ->
        p_o.stroke(30, 30, 30)
        # A simple way to draw the wave with an ellipse at each location
        for y in xvalues[0..xvalues.length-1] by 2
            p_o.line(xvalues[y], y * yspacing, xvalues[y + 1], (y + 1) * yspacing) 

	p_o.setup = () ->
        canvasDiv = document.getElementById('drawing-box')
        width = canvasDiv.offsetWidth
        height = canvasDiv.offsetHeight
        canvas = p_o.createCanvas(width, height)
        canvas.parent('drawing-canvas')
        dy = (p_o.TWO_PI / period) * yspacing
        h = height + 16
        xvalues = new Array(p_o.floor(h / yspacing))
        p_o.background(255)
        

    p_o.draw = () ->
        p_o.background(255)
        calcWave()
        renderWave()

    # p_o.windowResized = () -> 
	# 	canvasDiv = document.getElementById('drawing-box');
	# 	width = canvasDiv.offsetWidth;
	# 	height = canvasDiv.offsetHeight;
	# 	p_o.resizeCanvas(width, height);
	# 	p_o.background(255, 0, 200);


# Instantiate a local variable for p5
drawing_demo_p5 = new p5(drawing_demo, "drawing-canvas")




