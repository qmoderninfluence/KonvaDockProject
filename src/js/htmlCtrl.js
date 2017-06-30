var
			// Obtain a reference to the canvas element
				// using its id.
    htmlDiv = document.getElementById('divMainCanvas'),
		htmlCanvas = document.getElementById('mainCanvas'),
			  	// Obtain a graphics context on the
			  	// canvas element for drawing.
			  	context = htmlCanvas.getContext('2d');
			// Start listening to resize events and
			// draw canvas.
			var htmlDivHeight = htmlDiv.clientHeight;
			var htmlDivWidth = htmlDiv.clientWidth;
			//console.log("div.length1", htmlDivHeight)
			initialize();
			function initialize() {
				// Register an event listener to
				// call the resizeCanvas() function each time
				// the window is resized.
				window.addEventListener('resize', resizeCanvas, false);
				// Draw canvas border for the first time.
				resizeCanvas();
			}
			// Runs each time the DOM window resize event fires.
			// Resets the canvas dimensions to match window,
			// then draws the new borders accordingly.
			function resizeCanvas() {
				htmlCanvas.height = htmlDivWidth;
				htmlCanvas.width = htmlDivWidth;
				//console.log("div.length2", htmlDivHeight)
			}
