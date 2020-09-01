document.addEventListener('DOMContentLoaded', function() {
		//initializing ranges for HSL color. A nice feature is that
		// ANY number can be a hue in HSL, so you don't have to worry about going
		//over 360
		var min_color = 0
		var max_color = 360
		var min_gradient_incr = 10 //minimum difference between eeach color
		var max_gradient_incr = 30 //maximum difference between eeach color
		var sat = 93
		var light = 93
		var projects = document.getElementsByClassName("project_cont")
		var num_projects = projects.length
		for(i = 0; i<num_projects; i++) {
			min_color = Math.floor(Math.random() * (max_color-min_color) + min_color)
			color_string = "hsl("+min_color+","+sat+"%,"+light+"%)"
			projects[i].style.backgroundColor = color_string
			max_color = min_color + max_gradient_incr
			min_color = min_color + min_gradient_incr
		}
}, false);
