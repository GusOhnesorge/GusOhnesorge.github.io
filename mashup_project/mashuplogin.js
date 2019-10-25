function signIn(){
  var client_id = "efaa5403e2fb4a4aab9cb0fd9cf6d56a";
  var scopes = "user-modify-playback-state%20user-read-private%20user-read-email%20playlist-read-private";
  var redirect_uri = "https:%2f%2fgusohnesorge.github.io%2fmashuplogin.html";
  var response_type = "token";
  var width = 450,
      height = 730,
      left = (screen.width / 2) - (width / 2),
      top = (screen.height / 2) - (height / 2);
  var contents = document.createTextNode("test");
  var thediv = querySelector("#test");
  thediv.appendChild(contents);
  var url = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes}&response_type=${response_type}`;
  window.addEventListener("message", function(event) {
            var hash = JSON.parse(event.data);
            if (hash.type == 'access_token') {
                callback(hash.access_token);
            }
        }, false);
  var w = window.open(url,
                     'Spotify',
                     'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
}
