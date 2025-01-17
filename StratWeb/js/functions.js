$(document).ready(function() {
	// Play the audio when logo is clicked, if not playing already
    var audio = document.getElementById("backgroundMusic");
    $("#top img").click(function() {
		audio.play();
	});

    // Hide panels initially
	console.log("hiding panels, showing panel 1");
	$(".panel").hide();
	$("#panel1").show();

    $("#joinGameButton").click(function() {
        // Stop the audio if it's playing
        if (!audio.paused) {
            audio.pause();
        }
        // Hide panel1 and show panel2
		console.log("hiding panels, showing panel 2");
		$(".panel").hide();
        $("#panel2").show();
    });

    // Initialize Panzoom for the SVG image
    const elem = document.getElementById('mapImage');
    const panzoom = Panzoom(elem, {
        maxScale: 4,
        minScale: 0.5,
        step: 0.3,
        contain: 'outside'
    });
    // Zoom with buttons
    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');
    // Zoom with wheel
    elem.addEventListener('wheel', panzoom.zoomWithWheel);

    //Prevent rightclick menu
    const map = document.getElementById('mapContainer');
    map.addEventListener("contextmenu", (e) => {e.preventDefault()});

    zoomInButton.addEventListener('click', panzoom.zoomIn)
    zoomOutButton.addEventListener('click', panzoom.zoomOut)
    resetButton.addEventListener('click', panzoom.reset)
    rangeInput.addEventListener('input', (event) => {
      panzoom.zoom(event.target.valueAsNumber)
    })

    // Set initial zoom to 2x
    panzoom.zoomTo(0, 0, 2);

    // Enable touch gestures
    elem.addEventListener('touchstart', panzoom.handleTouch);
    elem.addEventListener('touchmove', panzoom.handleTouch);
    elem.addEventListener('touchend', panzoom.handleTouch);
    elem.addEventListener('wheel', panzoom.zoomWithWheel);

    // Add event listener to wrap the map horizontally
    elem.addEventListener('panzoomchange', () => {
        const panX = panzoom.getPan().x;
        const imageWidth = elem.clientWidth; // Since there are two images side by side

        if (panX > imageWidth) {
            panzoom.pan(panX - imageWidth, panzoom.getPan().y);
        } else if (panX < -imageWidth) {
            panzoom.pan(panX + imageWidth, panzoom.getPan().y);
        }
    });
});