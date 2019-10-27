//spotify_vars
var client_id = "efaa5403e2fb4a4aab9cb0fd9cf6d56a";
var current_playlist_ids = new Map();
var song_playing = false;
var shuffle = false;
var replay = false;
var device_id;
var access_tok;
//wikipedia vars
var reserved_table = new Map();
//general vars
var updateinterval;
//these are used so that the wiki isn't making a call every second, only when song changes
var cur_song = "";
var wiki_song = "";
//loading page
window.onload = pagesetup;

function pagesetup(){
  if(!window.location.hash){ //returns an empty string if there is no hash
    //This happens when a user says no to Spotify
  }
  else{
    //This happens when a user says yes to Spotify
    var hash = window.location.hash.substring(1).split('&');//This grabs the hash, gets rid of the #, and returns an array split by &
    var access_splt = hash[0].split("=");//access_splt is now an array containg the "token" label and then the token itself
    access_tok = access_splt[1]; //access_tok is used in calls to the Spotify API
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
  if(cur_song != wiki_song){
      wiki_song = cur_song;
      loadwiki();
  }
}

/* *************************************************************
  ******************  WIKIPEDIA FUNCTIONS  *********************
  ************************************************************** */
  async function loadwiki(){
    var name = document.querySelector("#artist_name");
    wikirequest(name.innerHTML);
    //for(var page in results.query.pages){
  //  }
  }

async function wikirequest(title){
  /*let wikiopts = {
    mode: "no-cors",
  }*/
  //var url = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=" + title + "&callback=?";
  var new_title = replace_reserved_chars(title);
  console.log(new_title);
  var body = document.querySelector("#wiki_body");
  var url = "https://en.wikipedia.org/w/api.php?action=parse&prop=text&page="+new_title+"&format=json&callback=?";
  $.getJSON(url, function(data) {
    console.log(data);
    var parsed_text = data.parse.text["*"];
    if(isredirect(parsed_text) == true){ //for redirect pages (they techincally have the "correct" title so I need to check text) It's also inelegant to hardcode like this but....
      wikiredirect(title, parsed_text);
    }
    else {//not redirect page
      if(isdisamb(parsed_text, title) == true){ //sometimes you get a disambugation page
        url = "https://en.wikipedia.org/w/api.php?action=parse&prop=text&page="+new_title+"_(band)&format=json&callback=?";
        $.getJSON(url, function(data) {//the redirect was probably wrong so lets try the original title+band
          console.log(data.error);
          if(data.error == null){
              var body = document.querySelector("#wiki_body");
              var parsed_text = data.parse.text["*"];
              body.innerHTML = parsed_text;
          }
          else{
              body.innerHTML = "Wiki page for"+title+" could not be located. Sorry :(";//this is a last case resort
          }
        });
      }
      else { //It was the actual page
        console.log(parsed_text);
        body.innerHTML = parsed_text;
      }
    }
  });
}

function isredirect(parsed_text){
  if(parsed_text.substring(42, 53) == "redirectMsg"){
    return true;
  }
  return false;
}

function isdisamb(parsed_text, title){
  console.log(parsed_text.substring(41+title.length, 53+title.length));
  if(parsed_text.substring(41+title.length, 53+title.length) == "may refer to"){ //This will always be here relative to the title name if the page is a disambiguation page
    return true;
  }
  return false;
}

async function wikiredirect(title, parsed_text){
  console.log("REDIRECTING");
    var done;
    var split_var = parsed_text.split("title="); //Redirect page will always look the same except for the title being redirected to. tricky splitting can get me the right page
    split_var = split_var[1].split("\"");
    var new_title = split_var[1];
    console.log(new_title);
    var new_title_band = replace_reserved_chars(new_title);
    var url = "https://en.wikipedia.org/w/api.php?action=parse&prop=text&page="+new_title_band+"_(band)&format=json&callback=?";
    $.getJSON(url, function(data) {//trying most specific first (redirect+band)
      console.log(data.error);
      if(data.error == null){
          var body = document.querySelector("#wiki_body");
          var parsed_text = data.parse.text["*"];
          body.innerHTML = parsed_text;
      }
      else{
        url = "https://en.wikipedia.org/w/api.php?action=parse&prop=text&page="+title+"_(band)&format=json&callback=?";
        $.getJSON(url, function(data) {//the redirect was probably wrong so lets try the original title+band
          console.log(data.error);
          if(data.error == null){
              var body = document.querySelector("#wiki_body");
              var parsed_text = data.parse.text["*"];
              body.innerHTML = parsed_text;
          }
          else{
              wikirequest(new_title);//trying the pure new title in case the new wiki page doesn't have the "band" classification
          }
        });
      }
    });
}

function replace_reserved_chars(title){
  if(reserved_table.length == 0){
    reserved_table.set(" ","_");
    reserved_table.set("!","%21");
    reserved_table.set("#","%23");
    reserved_table.set("$","%24");
    reserved_table.set("$","%24");
    reserved_table.set("%","%25");
    reserved_table.set("&","%26");
    reserved_table.set("\'","%27");
    reserved_table.set("(","%28");
    reserved_table.set(")","%29");
    reserved_table.set("*","%2A");
    reserved_table.set("+","%2B");
    reserved_table.set(",","%2C");
    reserved_table.set("/","%2F");
    reserved_table.set(":","%3A");
    reserved_table.set(";","%3B");
    reserved_table.set("=","%3D");
    reserved_table.set("@","%40");
    reserved_table.set("?","%3F");
    reserved_table.set("[","%5B");
    reserved_table.set("]","%5D");
  }
  for(var key in reserved_table){
    console.log(key+" "+reserved_table.get(key));
  }
  for(var i = 0; i<title.length;){
    var cur_char = title.charAt(i);
    var char_str = reserved_table.get(cur_char);
    console.log(cur_char+" "+char_str);
    if(char_str != null){
      title = title.substring(0,i+1) + char_str + title.substring(i+1); // cannot use str.replace() because % is a reserved char, but it is also added with numbers to replace the other reserved strings
      console.log(title);
      i+=3;
    }
    else {
      i++;
    }
  }
  return title;
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
      'Authorization': `Bearer ${access_tok}`
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
      'Authorization': `Bearer ${access_tok}`
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
      'Authorization': `Bearer ${access_tok}`
    }
  };
  let jsoninfo = await fetch("https://api.spotify.com/v1/me/player/currently-playing?market=us",songops);
  let info = await jsoninfo.json(); //ONLY GETS STUFF WHEN SONG PLAYING RIGHT NOW
  var song_name = document.querySelector("#song_name");
  var artist_name = document.querySelector("#artist_name");
  var song_img = document.querySelector("#song_img");
  song_name.innerHTML = info.item.name;
  cur_song = song_name.innerHTML;
  artist_name.innerHTML = info.item.artists[0].name;
  song_img.src = info.item.album.images[0].url;
}


  async function getdeviceid(){
    let infoopts = {
      method: 'GET',
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json",
        'Authorization': `Bearer ${access_tok}`
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
        'Authorization': `Bearer ${access_tok}`
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
        'Authorization': `Bearer ${access_tok}`
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
        'Authorization': `Bearer ${access_tok}`
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
        'Authorization': `Bearer ${access_tok}`
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


/* *************************************************************
  ****************  GENIUS LYRICS FUNCTIONS  *******************
  ************************************************************** */
/*
async function geniussignin(){
  var scopes = "me";
  var redirect_uri = "https://gusohnesorge.github.io/mashup_project/mashuplogin.html";
  var state = "test"; //normally this would be randomized and controlled to prevent fake authorization attempts
  var response_type = "token";
  var width = 450;
  var height = 730;
  var left = (screen.width / 2) - (width / 2);
  var top = (screen.height / 2) - (height / 2);
  g_url = `https://api.genius.com/oauth/authorize?client_id=${genius_client_id}&redirect_uri=${redirect_uri}&scope=${scopes}&state=${state}&response_type=${response_type}`;
  g_popup = window.open(g_url, 'Genius', 'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
  g_updateinterval = window.setInterval(geniuspopup, 100);

}

async function geniuspopup(){
  if(g_popup != null){
    var includes_token = g_popup.location.href.includes("token"); //deleting this breaks the if statements for some reason
    if(includes_token){
      //This happens when a user says yes to Genius

      //code block getting the code from the window
      var base = g_popup.location.href.split('&');//This array splits everything and the state. Should check state for consumer products
      g_popup.close();
      var code_split = base[0].split("=");//access_splt is now an array containg the "token" label and then the token itself
      genius_access_tok = code_split[1];*/ //genius_code is used to get genius_access_tok
      //getting authorization_code from genius
      /*let infoopts = {
        method: 'POST',
        body: JSON.stringify({
        "client_id" : genius_client_id,
        "code" : genius_code,
        "client_secret" : "C_3rJhRuvSV7Z4dUSmB4pJa1fJNKwMOD8sYWVyUf3jzwqGo19zLLaCtcroWxlXZTtvepIVGhugZUBVChSuendw", //should not technically hardcode in client secret
        "redirect_uri" : "https://gusohnesorge.github.io/mashup_project/mashup.html",
        "response_type" : "code",
        "grant_type" : "authorization_code"
        })
      };*/
      /*window.alert("4");
      let jsoninfo = await fetch("https://api.genius.com/oauth/token",infoopts);
      window.alert("5");
      let info = await jsoninfo.json();
      window.alert("6");
      genius_access_tok = info.access_token;
      window.alert(JSON.stringify(info));*/
    /*  var contents = document.createTextNode(genius_access_tok);
      var thediv = document.querySelector("#lyrics");
      thediv.appendChild(contents);
      loadlyrics();
    }
  }
  else{
    clearInterval(g_updateinterval);
  }
}

  async function loadlyrics(){
    window.alert("v3");
    let jsoninfo = await fetch(`https://api.genius.com/search?q=LilWayne&page=1&per_page=20&access_token=${genius_access_tok}`,
      {
      method:'GET' ,
      mode: "no-cors",
      credentials: "include",
      headers: {
      'Authorization': `Bearer ${genius_access_tok}`
      }
    });
    window.alert();
    var contents = document.createTextNode(JSON.stringify(response));
    var thediv = document.querySelector("#lyrics");
    thediv.appendChild(contents);
  }
*/
