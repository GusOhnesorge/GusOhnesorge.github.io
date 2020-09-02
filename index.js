document.addEventListener('DOMContentLoaded', function() {
		//initializing ranges for HSL color. A nice feature is that
		// ANY number can be a hue in HSL, so you don't have to worry about going
		//over 360
		window.scrollTo(0, 0);
		let min_color = 0
		let max_color = 360
		let min_gradient_incr = 5 //minimum difference between eeach color
		let max_gradient_incr = 10 //maximum difference between eeach color
		let sat = 93
		let light = 93
		let projects = document.getElementsByClassName("project_cont")
		let num_projects = projects.length
		for(i = 0; i<num_projects; i++) {
			min_color = Math.floor(Math.random() * (max_color-min_color) + min_color)
			color_string = "hsl("+min_color+","+sat+"%,"+light+"%)"
			projects[i].style.backgroundColor = color_string
			max_color = min_color + max_gradient_incr
			min_color = min_color + min_gradient_incr
		}
}, false);

//This block is for making the nav bar opaque when the user scrolls a certain
//distance
let last_known_scroll_position = 0
let ticking = false
let nav_opaque = false
let nav_color = "rgba(241,241,244,"

function switchNavOpacity(pos) {
	console.log(pos)
	pos = pos/400
	console.log(pos)
	if(pos>0.9){
		pos = 0.9
	}
	console.log(pos)
	let opacity = pos + ")"
	document.getElementById("nav1").style.backgroundColor = nav_color + opacity

}

window.addEventListener('scroll', function(e) {
  last_known_scroll_position = window.scrollY;

//this if statement is for reducing the number of times setNavOpaque is called
  if (!ticking) {
		console.log("scroll")
    window.requestAnimationFrame(function() {
	     switchNavOpacity(last_known_scroll_position)
      ticking = false;
    });

    ticking = true;
  }
});
