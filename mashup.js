var client_id = "efaa5403e2fb4a4aab9cb0fd9cf6d56a";
var access_tok;
window.onload = gethash;

async function gethash(){
  if(!window.location.hash){ //returns an empty string if there is no hash
    //This happens when a user says no to Spotify
  }
  else{
    //This happens when a user says yes to Spotify
    var hash = window.location.hash.substring(1).split('&');//This grabs the hash, gets rid of the #, and returns an array split by &
    var access_splt = hash[0].split("=");//access_splt is now an array containg the "token" label and then the token itself
    access_tok = access_splt[1]; //access_tok is used in calls to the Spotify API
    window.location.hash = "";
    window.alert(access_tok);
  }
  let infoopts = {
    method: 'GET',
    headers: {
      Accept: "application/json",
      Content-Type : "application/json",
      Authorization : `Bearer ${access_tok}`
    }
  };
  let jsoninfo = await fetch("https://api.spotify.com/v1/me",infoopts);
  let info = await jsoninfo.json();
  window.alert(info);

}
