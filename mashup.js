var client_id = "efaa5403e2fb4a4aab9cb0fd9cf6d56a";
window.onload(grabinfo)

async function grabinfo(){
  if(!window.location.hash){ //returns an empty string if there is no hash
    //This happens when a user says no to Spotify
  }
  else{
    //This happens when a user says yes to Spotify
    var hash = window.location.hash.substring(1).split('&');//This grabs the hash, gets ride of the #, and returns an array split by &
    var access_tok = (hash[0].split("="))[1];
    window.location.hash = "";
    window.alert(access_tok);
  }
}
