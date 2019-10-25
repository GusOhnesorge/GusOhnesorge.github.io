var hash;
var updateinterval;
var popup;

function signIn(){
  var client_id = "efaa5403e2fb4a4aab9cb0fd9cf6d56a";
  var scopes = "user-modify-playback-state%20user-read-private%20user-read-email%20playlist-read-private";
  var redirect_uri = "https:%2f%2fgusohnesorge.github.io%2fmashup_project%2fmashuplogin.html";
  var response_type = "token";
  var width = 450;
  var height = 730;
  var left = (screen.width / 2) - (width / 2);
  var top = (screen.height / 2) - (height / 2);
  var contents = document.createTextNode("test");
  var thediv = document.querySelector("#test");
  thediv.appendChild(contents);
  var url = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes}&response_type=${response_type}`;
  popup = window.open(url, 'Spotify', 'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
  updateinterval = window.setInterval(closepopup, 200);
}

function closepopup(){
  if(!popup.location.hash){ //returns an empty string if there is no hash
    //This happens when a user says no to Spotify
  }
  else{
    //This happens when a user says yes to Spotify
    hash = popup.location.hash.substring(1).split('&');//This grabs the hash, gets rid of the #, and returns an array split by &
    popup.close();
    var access_splt = hash[0].split("=");//access_splt is now an array containg the "token" label and then the token itself
    spotify_access_tok = access_splt[1]; //spotify_access_tok is used in calls to the Spotify API
    window.alert(hash);
  }
}
