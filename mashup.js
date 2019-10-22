var client_id = efaa5403e2fb4a4aab9cb0fd9cf6d56a;

async function signIn(){
  let opts = {
    method: 'GET'
  }

  let resp = await fetch(`https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=https://gusohnesorge.github.io/mashup.html&scope=playlist-read-private&response_type=token`, opts);
}
