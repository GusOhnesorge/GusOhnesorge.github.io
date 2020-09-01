document.addEventListener('DOMContentLoaded', function() {
		var min_color = 0
		var max_color = 360
		var sat = 93
		var light = 93
		var projects = document.getElementsByClassName("project")
		var num_projects = projects.length
		var rand_num = -1
		function getColor (min, max, colors_left){
			return Math.floor(Math.random() * (max-min-colors_left)) + min
		}
		for(i = 0; i<num_projects; i++) {
			min_color = getColor(min_color+1, max_color, num_projects-i)
			console.log(min_color)
			color_string = "hsl("+min_color+","+sat+"%,"+light+"%)"
			console.log(color_string)
			projects[i].style.backgroundColor = color_string
		}
}, false);
