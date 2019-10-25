var spotify_client_id = "efaa5403e2fb4a4aab9cb0fd9cf6d56a";
var musixmatch_client_id = "900b3ebed8019591e62be53c6770e077";
var current_playlist_ids = new Map();
var song_playing = false;
var shuffle = false;
var replay = false;
var device_id;
var spotify_access_tok;
var updateinterval;
window.onload = pagesetup;

function pagesetup(){
  if(!window.location.hash){ //returns an empty string if there is no hash
    //This happens when a user says no to Spotify
  }
  else{
    //This happens when a user says yes to Spotify
    var hash = window.location.hash.substring(1).split('&');//This grabs the hash, gets rid of the #, and returns an array split by &
    var access_splt = hash[0].split("=");//access_splt is now an array containg the "token" label and then the token itself
    spotify_access_tok = access_splt[1]; //spotify_access_tok is used in calls to the Spotify API
    window.location.hash = "";
  }
  loadinfo();
  loadplaylists();
  updateinterval = window.setInterval(updateloop, 1000);

}

/* *************************************************************
  ********************  GENERAL FUNCTIONS  *********************
  ************************************************************** */
async function updateloop(){
  loadsong();
}

/* *************************************************************
  ****************  GENIUS LYRICS FUNCTIONS  *******************
  ************************************************************** */

  async function loadlyrics(){

  }

/* *************************************************************
  ********************  SPOTIFY FUNCTIONS  *********************
  ************************************************************** */

async function loadinfo(){
  let infoopts = {
    method: 'GET',
    headers: {
      'Accept': "application/json",
      'Content-Type': "application/json",
      'Authorization': `Bearer ${spotify_access_tok}`
    }
  };
  let jsoninfo = await fetch("https://api.spotify.com/v1/me",infoopts);
  let info = await jsoninfo.json();
  var t = document.querySelector("#info_table");
  var trow;
  var td, contents;
  var infolist = [info.display_name, info.email];
  var labellist = ["Display Name: ", "Email: "];
  for(let i = 0; i<2; i++){
    td = document.createElement("td");
    trow = document.createElement("tr");
    contents = document.createTextNode(labellist[i]+infolist[i]);
    td.appendChild(contents);
    trow.appendChild(td);
    t.appendChild(trow);
  }
  var img = document.querySelector("#profile_pic_img");
  img.src = info.images[0].url;
}

async function loadplaylists(){
  var n_playlists = 10;
  let infoopts = {
    method: 'GET',
    headers: {
      'Accept': "application/json",
      'Content-Type': "application/json",
      'Authorization': `Bearer ${spotify_access_tok}`
    }
  };
  let jsoninfo = await fetch(`https://api.spotify.com/v1/me/playlists?limit=${n_playlists}`,infoopts);
  let info = await jsoninfo.json();
  var t = document.querySelector("#playlist_table");
  var trow, td, contents, td_button;
  for(let i = 0; i<10; i++){
    td = document.createElement("td");
    trow = document.createElement("tr");
    contents = document.createTextNode(info.items[i].name);
    current_playlist_ids.set(info.items[i].name, info.items[i].id);//each "item" is a playlist object and i'm getting their info
    td.appendChild(contents);
    td.id = info.items[i].name;
    td.addEventListener("click", chooseplaylist, false); //make playlists clickable
    trow.appendChild(td);
    t.appendChild(trow);
  }
}

async function loadsong(){
  let songops = {
    method: 'GET',
    headers: {
      'Accept': "application/json",
      'Content-Type': "application/json",
      'Authorization': `Bearer ${spotify_access_tok}`
    }
  };
  let jsoninfo = await fetch("https://api.spotify.com/v1/me/player/currently-playing?market=us",songops);
  let info = await jsoninfo.json(); //ONLY GETS STUFF WHEN SONG PLAYING RIGHT NOW
  var song_name = document.querySelector("#song_name");
  var artist_name = document.querySelector("#artist_name");
  var song_img = document.querySelector("#song_img");
  song_name.innerHTML = info.item.name;
  artist_name.innerHTML = info.item.artists[0].name;
  song_img.src = info.item.album.images[0].url;
}


  async function getdeviceid(){
    let infoopts = {
      method: 'GET',
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json",
        'Authorization': `Bearer ${spotify_access_tok}`
      }
    };
    let jsoninfo = await fetch("https://api.spotify.com/v1/me/player/devices",infoopts);
    let info = await jsoninfo.json();
    for(let i = 0; i<info.devices.length;i++){
      if(info.devices[i].name == "MusicInfoPlayer"){
        device_id = info.devices[i].id;
        i = i+info.devices.length;
      }
    }
  }

  async function setdevice(){
    getdeviceid();
    let infoopts = {
      method: 'PUT',
      body: JSON.stringify({"device_ids" : [device_id], "play": false}),
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json",
        'Authorization': `Bearer ${spotify_access_tok}`
      }
    };
    let jsoninfo = await fetch(`https://api.spotify.com/v1/me/player`,infoopts);
  }

  async function playdevice(){
    let infoopts = {
      method: 'PUT',
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json",
        'Authorization': `Bearer ${spotify_access_tok}`
      }
    };
    let jsoninfo = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,infoopts);
  }

  async function pausedevice(){
    let infoopts = {
      method: 'PUT',
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json",
        'Authorization': `Bearer ${spotify_access_tok}`
      }
    };
    let jsoninfo = await fetch("https://api.spotify.com/v1/me/player/pause",infoopts);
  }

  async function chooseplaylist(){
    var playlist_id = current_playlist_ids.get(this.id);
    let playlistops = {
      method: 'GET',
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json",
        'Authorization': `Bearer ${spotify_access_tok}`
      }
    };
    let jsoninfo = await fetch(`https://api.spotify.com/v1/me/playlists/${playlist_id}`,playlistops);
    let info = await jsoninfo.json();
    setdevice();
  }

  async function play_pause(){
    if(song_playing){
      song_playing = false;
      var play_button = document.querySelector("#play");
      play_button.src = "images/play.png";
      pausedevice();
    }
    else{
      song_playing = true;
      var play_button = document.querySelector("#play");
      play_button.src = "images/pause.jpg";
      playdevice();
      loadsong();
    }
  }

  async function pressshuffle(){
    if(shuffle){
      shuffle = false;
      var shuffle_button = document.querySelector("#shuffle");
      shuffle_button.src = "images/shuffle_off.png";
    }
    else{
      shuffle = true;
      var shuffle_button = document.querySelector("#shuffle");
      shuffle_button.src = "images/shuffle_on.png";
    }
  }

  async function pressreplay(){
    if(replay){
      replay = false;
      var replay_button = document.querySelector("#replay");
      replay_button.src = "images/replay_off.png";
    }
    else{
      replay = true;
      var replay_button = document.querySelector("#replay");
      replay_button.src = "images/replay_on.png";
    }
  }
