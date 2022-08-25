var Spotify = require('spotify-web-api-js'); //bundle from spotify js
var s = new Spotify();

var SpotifyWebApi = require('spotify-web-api-js'); //bundle from spotify js
var spotifyApi = new SpotifyWebApi();

var accessToken = 'BQBEAEtHRHPcHwBQPLDfVke-8H9QOSvNRMOqrW3fqIamJDYvD9wFGn5dUl1SSALpul6h4goE66qhGm_wtfIuCucLYe9-AnabHO1vAlhkbxKMpiIz0xzZ_dvQD3xeZsNOtvMVXnb5kDdnoDJDOTlNPudaLAKqQzCbrPITRzCDqQbFHWy8N-0flPKqHY1yj9Z4eNA';
spotifyApi.setAccessToken(accessToken); //put access token here

spotifyApi.getArtistAlbums(['0TnOYISbd1XYRBk9myaseg'])
    .then(function(data) {
        console.log('Artist albums', data);
        document.getElementById("third").innerHTML =
        data.items[12].name; //diplay api data on the screen 
    }, function(err) {
        console.error(err);
    });

/* Below add to artists of the user and their top songs (30 songs total) */   
/* Emotions */
const energetic = [0.85, 0.9, 1.0];
const excited = [0.85, 0.6, 0.7];
const angry = [0.1, 0.3, 0.8];
const joyful = [0.9, 0.5, 0.5];
const calm = [0.6, 0.1, 0.1];
const sad = [0.1, 0.1, 0.3];
const average_emotion = [0.8, 0.8, 0.8];

var songURIarray = [];
var songIDarray = [];
var top_artistsID_array = [];
var song_final_URI_array = [];
var song_final_ID_array = [];


var userID = 'jx2werner'; //user ID
var emotion_nameOfPlaylist = "Mood Swing Playlist"; //emotion chosen
var playListID = '';

/* create playlist function*/

spotifyApi.createPlaylist(userID, {name: emotion_nameOfPlaylist, public: true})
    .then(function(data) {
      console.log('Create playlist', data);
      playListID = data.id;
      console.log(playListID);
    })
//this creates the playlist and fetches the playlist id

/* getMyTopTracks function which adds the songs to the playlist after getting user's top tracks*/

spotifyApi.getMyTopTracks({limit: 50})
    .then(function(data) {
      console.log('Top tracks', data);

      var songIDstring = '';
      var i;
      for (i = 0; i < 50; i++) {
        songIDstring = songIDstring + ',' + String(data.items[i].id);
        songURIarray.push(String(data.items[i].uri + ""));
        songIDarray.push(String(data.items[i].id + ""));
        top_artistsID_array.push(String(data.items[i].artists[0].id));
      } //create songURIarray and songIDarray containing 50 uris from the top track

      songIDstring = 'ids=' + songIDstring.substring(1);
      console.log('songIDstring:', songIDstring); //diplays 50 song IDs
      console.log('top_artistsID_array', top_artistsID_array); //displays top artists from the top tracks

      var l;
      
      var length_song_final_uri;
  
      for(l = 0; l < 50; l++) {
        spotifyApi.getArtistTopTracks(top_artistsID_array[l], 'US')
          .then(function(data) {
            var y;
            for (y = 0; y < data.tracks.length; y++) {
              song_final_ID_array.push(String(data.tracks[y].id));
              song_final_URI_array.push(String(data.tracks[y].uri));
            }
          }); 
      }

      console.log('song_final_URI_array:', song_final_URI_array);
      console.log('song_final_ID_array:', song_final_ID_array);

      /* get audio feature for tracks function */
      /* audio feature variables */
      var valence;
      var danceability;
      var energy;
    
      setTimeout(function() {
      for (var t = 0; t < 100; t++) {
        spotifyApi.getAudioFeaturesForTrack(song_final_ID_array[t])
          .then(function(data) {
            valence = data.valence;
            danceability = data.danceability;
            energy = data.energy;
            console.log('energy:', energy);
            console.log('data:', data);

            const v = Math.abs(valence - average_emotion[0]);
            const d = Math.abs(danceability - average_emotion[1]);
            const e = Math.abs(energy - average_emotion[2]);

            /* add song to the playlist if within range*/
            if (v <= 0.2 && d <= 0.2 && e <= 0.2) {
              addplaylist(userID, data.uri, playListID, accessToken);
              console.log('song uri that has been added', data.uri)
            }
          });
      }     //loops over the song_final_URI array and checks if it should be added to the playlist
    }, 10000);
    }, function(err) {
      console.error(err);
    }); //this creates songURIarray and adds them to the list
  

/* addplaylist function*/

function addplaylist(userID, uri, playListID, accessToken) {
   $.ajax({
      dataType: 'text',
      type: 'post',
      url: 'https://api.spotify.com/v1/users/' + userID + '/playlists/' + playListID + '/tracks?uris='+ uri,
      headers: {
         Authorization: "Bearer "+ accessToken,
      },success: function (response) {
        alert(response);
      }
  });
}; //this 'posts' the songs into the playlist with given userID, uri, playlistID, and the accesstoken

/* hide alert from the window */
window.alert = function() {};
