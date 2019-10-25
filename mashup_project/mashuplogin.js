function signIn(){
  var client_id = "efaa5403e2fb4a4aab9cb0fd9cf6d56a";
  var scopes = "user-modify-playback-state%20user-read-private%20user-read-email%20playlist-read-private";
  var redirect_uri = "https:%2f%2fgusohnesorge.github.io%2fmasuhp_project%2fmashup.html";
  var response_type = "token";
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes}&response_type=${response_type}`;
}
