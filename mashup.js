var client_id = efaa5403e2fb4a4aab9cb0fd9cf6d56a;

async function signIn(){
  let opts = {
    method: 'POST'
  }
  let resp = fetch("https://accounts.spotify.com/authorize?client_id=efaa5403e2fb4a4aab9cb0fd9cf6d56a&redirect_uri=https:%2F%2Fgusohnesorge.github.io%2Fmashup.html&scope=user-read-private%20user-read-email%20playlist-read-private&response_type=token", opts);
}
