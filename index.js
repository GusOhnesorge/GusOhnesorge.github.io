document.addEventListener('DOMContentLoaded', function() {
		var min_color = 195
		var max_color = 300
		var sat = 93
		var light = 93
		var projects = getElementsByClassName("project")
		var num_projects = projects.length
		var rand_num = -1
		function getColor (min, max, colors_left){
			return Math.floor(Math.random() * (max-min-colors_left)) + min
		}
		for project in projects {
			min_color = getColor(min_color, max_color, num_projects)
			color_string = "hsl("+min_color.toString()+","+sat.toString()+"%,"+light.toString()+"%)"
			project.style.backgroundColor = color_string
			num_projects = num_projects - 1
		}
}, false);
