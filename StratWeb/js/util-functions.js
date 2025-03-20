// Override addEventListener to force passive for touchstart and touchmove
const originalAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type, listener, options) {
  if (type === "touchstart" || type === "touchmove") {
    options = { passive: true, ...options };
  }
  originalAddEventListener.call(this, type, listener, options);
};

$(document).ready(function() {
	// Play the audio when logo is clicked, if not playing already
    var audio = document.getElementById("backgroundMusic");
    $("#top img").click(function() {
		audio.play();
	});

    // Hide panels initially
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

    //Prevent rightclick menu
	document.addEventListener("DOMContentLoaded", () => {
	  // Prevent right-click menu
	  const map = document.getElementById('mapContainer');
	  if (map) {
		map.addEventListener("contextmenu", (e) => {
		  e.preventDefault();
		});
	  } else {
		console.error("mapContainer not found!");
	  }
	});
});