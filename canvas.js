(function() {
	// Get a regular interval for drawing to the screen
	window.requestAnimFrame = (function (callback) {
		return window.requestAnimationFrame || 
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimaitonFrame ||
			function (callback) {
			 	window.setTimeout(callback, 1000/60);
			};
	})();

	const canvas = document.getElementById("sign-canvas");
	const ctx = canvas.getContext("2d");
	
  // canvas style
  ctx.strokeStyle = "#000";
	ctx.lineWith = 3;

	// Set up the UI
	const sigText = document.getElementById("sign-dataUrl");
	const sigImage = document.getElementById("sign-image");
	const clearBtn = document.getElementById("sign-clear");
	const submitBtn = document.getElementById("sign-submit");
  const restoreBtn = document.getElementById("sign-restore");
	
  clearBtn.addEventListener("click", function (e) {
		clearCanvas();
		sigText.innerHTML = "Data URL for your signature will go here!";
		sigImage.setAttribute("src", "");
	});

  submitBtn.addEventListener("click", function (e) {
		const dataUrl = canvas.toDataURL();
		sigText.innerHTML = dataUrl;
		sigImage.setAttribute("src", dataUrl);
	});

  restoreBtn.addEventListener("click", function (e) {
    clearCanvas();
    const restoreImg = new Image();
    restoreImg.src = sigImage.src;
    ctx.width = restoreImg.width;
    ctx.height = restoreImg.height;
    ctx.drawImage(restoreImg, 0, 0);
  });

	// Set up mouse events for drawing
	var drawing = false;
	var mousePos = { x: 0, y: 0 };
	var lastPos = mousePos;

	canvas.addEventListener("mousedown", function (e) {
		drawing = true;
		lastPos = getMousePos(canvas, e);
	});

	canvas.addEventListener("mouseup", function (e) {
		drawing = false;
	});

	canvas.addEventListener("mousemove", function (e) {
		mousePos = getMousePos(canvas, e);
	});

	// Set up touch events for mobile, etc
	canvas.addEventListener("touchstart", function (e) {
		mousePos = getTouchPos(canvas, e);
		const touch = e.touches[0];
		const mouseEvent = new MouseEvent("mousedown", {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	});

	canvas.addEventListener("touchend", function (e) {
		const mouseEvent = new MouseEvent("mouseup", {});
		canvas.dispatchEvent(mouseEvent);
	});

	canvas.addEventListener("touchmove", function (e) {
		const touch = e.touches[0];
		const mouseEvent = new MouseEvent("mousemove", {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	});

	canvas.addEventListener('touchleave', function (e) {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
  });

  canvas.addEventListener('touchcancel', function (e) {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
  });

	// Prevent scrolling when touching the canvas
	document.body.addEventListener("touchstart", function (e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	});
	document.body.addEventListener("touchend", function (e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	});
	document.body.addEventListener("touchmove", function (e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	});

	window.addEventListener('resize', resizeCanvas);

	function resizeCanvas() {
		const width = document.body.clientWidth;
		console.log(width);
		if (width < 650) {
			canvas.width = width - 160;
		}
  }

  resizeCanvas();

	// Get the position of the mouse relative to the canvas
	function getMousePos(canvasDom, mouseEvent) {
		var rect = canvasDom.getBoundingClientRect();
		return {
			x: mouseEvent.clientX - rect.left,
			y: mouseEvent.clientY - rect.top
		};
	}

	// Get the position of a touch relative to the canvas
	function getTouchPos(canvasDom, touchEvent) {
		var rect = canvasDom.getBoundingClientRect();
		return {
			x: touchEvent.touches[0].clientX - rect.left,
			y: touchEvent.touches[0].clientY - rect.top
		};
	}

	// Draw to the canvas
	function renderCanvas() {
		if (drawing) {
			ctx.moveTo(lastPos.x, lastPos.y);
			ctx.lineTo(mousePos.x, mousePos.y);
			ctx.stroke();
			lastPos = mousePos;
		}
	}

	function clearCanvas() {
		canvas.width = canvas.width;
	}

	// Allow for animation
	(function drawLoop () {
		requestAnimFrame(drawLoop);
		renderCanvas();
	})();

})();