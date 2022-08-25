(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
  exports.endianness = function () { return 'LE' };
  
  exports.hostname = function () {
      if (typeof location !== 'undefined') {
          return location.hostname
      }
      else return '';
  };
  
  exports.loadavg = function () { return [] };
  
  exports.uptime = function () { return 0 };
  
  exports.freemem = function () {
      return Number.MAX_VALUE;
  };
  
  exports.totalmem = function () {
      return Number.MAX_VALUE;
  };
  
  exports.cpus = function () { return [] };
  
  exports.type = function () { return 'Browser' };
  
  exports.release = function () {
      if (typeof navigator !== 'undefined') {
          return navigator.appVersion;
      }
      return '';
  };
  
  exports.networkInterfaces
  = exports.getNetworkInterfaces
  = function () { return {} };
  
  exports.arch = function () { return 'javascript' };
  
  exports.platform = function () { return 'browser' };
  
  exports.tmpdir = exports.tmpDir = function () {
      return '/tmp';
  };
  
  exports.EOL = '\n';
  
  exports.homedir = function () {
    return '/'
  };
  
  },{}],2:[function(require,module,exports){
  // shim for using process in browser
  var process = module.exports = {};
  
  // cached from whatever global is present so that test runners that stub it
  // don't break things.  But we need to wrap it in a try catch in case it is
  // wrapped in strict mode code which doesn't define any globals.  It's inside a
  // function because try/catches deoptimize in certain engines.
  
  var cachedSetTimeout;
  var cachedClearTimeout;
  
  function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
  }
  function defaultClearTimeout () {
      throw new Error('clearTimeout has not been defined');
  }
  (function () {
      try {
          if (typeof setTimeout === 'function') {
              cachedSetTimeout = setTimeout;
          } else {
              cachedSetTimeout = defaultSetTimout;
          }
      } catch (e) {
          cachedSetTimeout = defaultSetTimout;
      }
      try {
          if (typeof clearTimeout === 'function') {
              cachedClearTimeout = clearTimeout;
          } else {
              cachedClearTimeout = defaultClearTimeout;
          }
      } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
      }
  } ())
  function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
      } catch(e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
              return cachedSetTimeout.call(null, fun, 0);
          } catch(e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
              return cachedSetTimeout.call(this, fun, 0);
          }
      }
  
  
  }
  function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
      } catch (e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
              return cachedClearTimeout.call(null, marker);
          } catch (e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
              // Some versions of I.E. have different rules for clearTimeout vs setTimeout
              return cachedClearTimeout.call(this, marker);
          }
      }
  
  
  
  }
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;
  
  function cleanUpNextTick() {
      if (!draining || !currentQueue) {
          return;
      }
      draining = false;
      if (currentQueue.length) {
          queue = currentQueue.concat(queue);
      } else {
          queueIndex = -1;
      }
      if (queue.length) {
          drainQueue();
      }
  }
  
  function drainQueue() {
      if (draining) {
          return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;
  
      var len = queue.length;
      while(len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
              if (currentQueue) {
                  currentQueue[queueIndex].run();
              }
          }
          queueIndex = -1;
          len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
  }
  
  process.nextTick = function (fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
          }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
      }
  };
  
  // v8 likes predictible objects
  function Item(fun, array) {
      this.fun = fun;
      this.array = array;
  }
  Item.prototype.run = function () {
      this.fun.apply(null, this.array);
  };
  process.title = 'browser';
  process.browser = true;
  process.env = {};
  process.argv = [];
  process.version = ''; // empty string to avoid regexp issues
  process.versions = {};
  
  function noop() {}
  
  process.on = noop;
  process.addListener = noop;
  process.once = noop;
  process.off = noop;
  process.removeListener = noop;
  process.removeAllListeners = noop;
  process.emit = noop;
  process.prependListener = noop;
  process.prependOnceListener = noop;
  
  process.listeners = function (name) { return [] }
  
  process.binding = function (name) {
      throw new Error('process.binding is not supported');
  };
  
  process.cwd = function () { return '/' };
  process.chdir = function (dir) {
      throw new Error('process.chdir is not supported');
  };
  process.umask = function() { return 0; };
  
  },{}],3:[function(require,module,exports){
  /* global module */
  'use strict';
  
  /**
   * Class representing the API
   */
  var SpotifyWebApi = (function() {
    var _baseUri = 'https://api.spotify.com/v1';
    var _accessToken = null;
    var _promiseImplementation = null;
  
    var WrapPromiseWithAbort = function(promise, onAbort) {
      promise.abort = onAbort;
      return promise;
    };
  
    var _promiseProvider = function(promiseFunction, onAbort) {
      var returnedPromise;
      if (_promiseImplementation !== null) {
        var deferred = _promiseImplementation.defer();
        promiseFunction(
          function(resolvedResult) {
            deferred.resolve(resolvedResult);
          },
          function(rejectedResult) {
            deferred.reject(rejectedResult);
          }
        );
        returnedPromise = deferred.promise;
      } else {
        if (window.Promise) {
          returnedPromise = new window.Promise(promiseFunction);
        }
      }
  
      if (returnedPromise) {
        return new WrapPromiseWithAbort(returnedPromise, onAbort);
      } else {
        return null;
      }
    };
  
    var _extend = function() {
      var args = Array.prototype.slice.call(arguments);
      var target = args[0];
      var objects = args.slice(1);
      target = target || {};
      objects.forEach(function(object) {
        for (var j in object) {
          if (object.hasOwnProperty(j)) {
            target[j] = object[j];
          }
        }
      });
      return target;
    };
  
    var _buildUrl = function(url, parameters) {
      var qs = '';
      for (var key in parameters) {
        if (parameters.hasOwnProperty(key)) {
          var value = parameters[key];
          qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
        }
      }
      if (qs.length > 0) {
        // chop off last '&'
        qs = qs.substring(0, qs.length - 1);
        url = url + '?' + qs;
      }
      return url;
    };
  
    var _performRequest = function(requestData, callback) {
      var req = new XMLHttpRequest();
  
      var promiseFunction = function(resolve, reject) {
        function success(data) {
          if (resolve) {
            resolve(data);
          }
          if (callback) {
            callback(null, data);
          }
        }
  
        function failure() {
          if (reject) {
            reject(req);
          }
          if (callback) {
            callback(req, null);
          }
        }
  
        var type = requestData.type || 'GET';
        req.open(type, _buildUrl(requestData.url, requestData.params));
        if (_accessToken) {
          req.setRequestHeader('Authorization', 'Bearer ' + _accessToken);
        }
        if (requestData.contentType) {
          req.setRequestHeader('Content-Type', requestData.contentType)
        }
  
        req.onreadystatechange = function() {
          if (req.readyState === 4) {
            var data = null;
            try {
              data = req.responseText ? JSON.parse(req.responseText) : '';
            } catch (e) {
              console.error(e);
            }
  
            if (req.status >= 200 && req.status < 300) {
              success(data);
            } else {
              failure();
            }
          }
        };
  
        if (type === 'GET') {
          req.send(null);
        } else {
          var postData = null
          if (requestData.postData) {
            postData = requestData.contentType === 'image/jpeg' ? requestData.postData : JSON.stringify(requestData.postData)
          }
          req.send(postData);
        }
      };
  
      if (callback) {
        promiseFunction();
        return null;
      } else {
        return _promiseProvider(promiseFunction, function() {
          req.abort();
        });
      }
    };
  
    var _checkParamsAndPerformRequest = function(requestData, options, callback, optionsAlwaysExtendParams) {
      var opt = {};
      var cb = null;
  
      if (typeof options === 'object') {
        opt = options;
        cb = callback;
      } else if (typeof options === 'function') {
        cb = options;
      }
  
      // options extend postData, if any. Otherwise they extend parameters sent in the url
      var type = requestData.type || 'GET';
      if (type !== 'GET' && requestData.postData && !optionsAlwaysExtendParams) {
        requestData.postData = _extend(requestData.postData, opt);
      } else {
        requestData.params = _extend(requestData.params, opt);
      }
      return _performRequest(requestData, cb);
    };
  
    /**
     * Creates an instance of the wrapper
     * @constructor
     */
    var Constr = function() {};
  
    Constr.prototype = {
      constructor: SpotifyWebApi
    };
  
    /**
     * Fetches a resource through a generic GET request.
     *
     * @param {string} url The URL to be fetched
     * @param {function(Object,Object)} callback An optional callback
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getGeneric = function(url, callback) {
      var requestData = {
        url: url
      };
      return _checkParamsAndPerformRequest(requestData, callback);
    };
  
    /**
     * Fetches information about the current user.
     * See [Get Current User's Profile](https://developer.spotify.com/web-api/get-current-users-profile/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getMe = function(options, callback) {
      var requestData = {
        url: _baseUri + '/me'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Fetches current user's saved tracks.
     * See [Get Current User's Saved Tracks](https://developer.spotify.com/web-api/get-users-saved-tracks/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getMySavedTracks = function(options, callback) {
      var requestData = {
        url: _baseUri + '/me/tracks'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Adds a list of tracks to the current user's saved tracks.
     * See [Save Tracks for Current User](https://developer.spotify.com/web-api/save-tracks-user/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
     * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.addToMySavedTracks = function(trackIds, options, callback) {
      var requestData = {
        url: _baseUri + '/me/tracks',
        type: 'PUT',
        postData: trackIds
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Remove a list of tracks from the current user's saved tracks.
     * See [Remove Tracks for Current User](https://developer.spotify.com/web-api/remove-tracks-user/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
     * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.removeFromMySavedTracks = function(trackIds, options, callback) {
      var requestData = {
        url: _baseUri + '/me/tracks',
        type: 'DELETE',
        postData: trackIds
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Checks if the current user's saved tracks contains a certain list of tracks.
     * See [Check Current User's Saved Tracks](https://developer.spotify.com/web-api/check-users-saved-tracks/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
     * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.containsMySavedTracks = function(trackIds, options, callback) {
      var requestData = {
        url: _baseUri + '/me/tracks/contains',
        params: { ids: trackIds.join(',') }
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Get a list of the albums saved in the current Spotify user's "Your Music" library.
     * See [Get Current User's Saved Albums](https://developer.spotify.com/web-api/get-users-saved-albums/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getMySavedAlbums = function(options, callback) {
      var requestData = {
        url: _baseUri + '/me/albums'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Save one or more albums to the current user's "Your Music" library.
     * See [Save Albums for Current User](https://developer.spotify.com/web-api/save-albums-user/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI, it is easy
     * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.addToMySavedAlbums = function(albumIds, options, callback) {
      var requestData = {
        url: _baseUri + '/me/albums',
        type: 'PUT',
        postData: albumIds
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Remove one or more albums from the current user's "Your Music" library.
     * See [Remove Albums for Current User](https://developer.spotify.com/web-api/remove-albums-user/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI, it is easy
     * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.removeFromMySavedAlbums = function(albumIds, options, callback) {
      var requestData = {
        url: _baseUri + '/me/albums',
        type: 'DELETE',
        postData: albumIds
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Check if one or more albums is already saved in the current Spotify user's "Your Music" library.
     * See [Check User's Saved Albums](https://developer.spotify.com/web-api/check-users-saved-albums/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI, it is easy
     * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.containsMySavedAlbums = function(albumIds, options, callback) {
      var requestData = {
        url: _baseUri + '/me/albums/contains',
        params: { ids: albumIds.join(',') }
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Get the current user’s top artists based on calculated affinity.
     * See [Get a User’s Top Artists](https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getMyTopArtists = function(options, callback) {
      var requestData = {
        url: _baseUri + '/me/top/artists'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Get the current user’s top tracks based on calculated affinity.
     * See [Get a User’s Top Tracks](https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getMyTopTracks = function(options, callback) {
      var requestData = {
        url: _baseUri + '/me/top/tracks'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Get tracks from the current user’s recently played tracks.
     * See [Get Current User’s Recently Played Tracks](https://developer.spotify.com/web-api/web-api-personalization-endpoints/get-recently-played/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getMyRecentlyPlayedTracks = function(options, callback) {
      var requestData = {
        url: _baseUri + '/me/player/recently-played'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Adds the current user as a follower of one or more other Spotify users.
     * See [Follow Artists or Users](https://developer.spotify.com/web-api/follow-artists-users/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
     * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is an empty value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.followUsers = function(userIds, callback) {
      var requestData = {
        url: _baseUri + '/me/following/',
        type: 'PUT',
        params: {
          ids: userIds.join(','),
          type: 'user'
        }
      };
      return _checkParamsAndPerformRequest(requestData, callback);
    };
  
    /**
     * Adds the current user as a follower of one or more artists.
     * See [Follow Artists or Users](https://developer.spotify.com/web-api/follow-artists-users/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
     * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is an empty value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.followArtists = function(artistIds, callback) {
      var requestData = {
        url: _baseUri + '/me/following/',
        type: 'PUT',
        params: {
          ids: artistIds.join(','),
          type: 'artist'
        }
      };
      return _checkParamsAndPerformRequest(requestData, callback);
    };
  
    /**
     * Add the current user as a follower of one playlist.
     * See [Follow a Playlist](https://developer.spotify.com/web-api/follow-playlist/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
     * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
     * @param {Object} options A JSON object with options that can be passed. For instance,
     * whether you want the playlist to be followed privately ({public: false})
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is an empty value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.followPlaylist = function(playlistId, options, callback) {
      var requestData = {
        url: _baseUri + '/playlists/' + playlistId + '/followers',
        type: 'PUT',
        postData: {}
      };
  
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Removes the current user as a follower of one or more other Spotify users.
     * See [Unfollow Artists or Users](https://developer.spotify.com/web-api/unfollow-artists-users/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
     * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is an empty value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.unfollowUsers = function(userIds, callback) {
      var requestData = {
        url: _baseUri + '/me/following/',
        type: 'DELETE',
        params: {
          ids: userIds.join(','),
          type: 'user'
        }
      };
      return _checkParamsAndPerformRequest(requestData, callback);
    };
  
    /**
     * Removes the current user as a follower of one or more artists.
     * See [Unfollow Artists or Users](https://developer.spotify.com/web-api/unfollow-artists-users/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
     * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is an empty value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.unfollowArtists = function(artistIds, callback) {
      var requestData = {
        url: _baseUri + '/me/following/',
        type: 'DELETE',
        params: {
          ids: artistIds.join(','),
          type: 'artist'
        }
      };
      return _checkParamsAndPerformRequest(requestData, callback);
    };
  
    /**
     * Remove the current user as a follower of one playlist.
     * See [Unfollow a Playlist](https://developer.spotify.com/web-api/unfollow-playlist/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
     * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is an empty value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.unfollowPlaylist = function(playlistId, callback) {
      var requestData = {
        url: _baseUri + '/playlists/' + playlistId + '/followers',
        type: 'DELETE'
      };
      return _checkParamsAndPerformRequest(requestData, callback);
    };
  
    /**
     * Checks to see if the current user is following one or more other Spotify users.
     * See [Check if Current User Follows Users or Artists](https://developer.spotify.com/web-api/check-current-user-follows/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
     * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is an array of boolean values that indicate
     * whether the user is following the users sent in the request.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.isFollowingUsers = function(userIds, callback) {
      var requestData = {
        url: _baseUri + '/me/following/contains',
        type: 'GET',
        params: {
          ids: userIds.join(','),
          type: 'user'
        }
      };
      return _checkParamsAndPerformRequest(requestData, callback);
    };
  
    /**
     * Checks to see if the current user is following one or more artists.
     * See [Check if Current User Follows](https://developer.spotify.com/web-api/check-current-user-follows/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
     * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is an array of boolean values that indicate
     * whether the user is following the artists sent in the request.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.isFollowingArtists = function(artistIds, callback) {
      var requestData = {
        url: _baseUri + '/me/following/contains',
        type: 'GET',
        params: {
          ids: artistIds.join(','),
          type: 'artist'
        }
      };
      return _checkParamsAndPerformRequest(requestData, callback);
    };
  
    /**
     * Check to see if one or more Spotify users are following a specified playlist.
     * See [Check if Users Follow a Playlist](https://developer.spotify.com/web-api/check-user-following-playlist/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
     * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
     * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
     * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is an array of boolean values that indicate
     * whether the users are following the playlist sent in the request.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.areFollowingPlaylist = function(playlistId, userIds, callback) {
      var requestData = {
        url: _baseUri + '/playlists/' + playlistId + '/followers/contains',
        type: 'GET',
        params: {
          ids: userIds.join(',')
        }
      };
      return _checkParamsAndPerformRequest(requestData, callback);
    };
  
    /**
     * Get the current user's followed artists.
     * See [Get User's Followed Artists](https://developer.spotify.com/web-api/get-followed-artists/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Object} [options] Options, being after and limit.
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is an object with a paged object containing
     * artists.
     * @returns {Promise|undefined} A promise that if successful, resolves to an object containing a paging object which contains
     * artists objects. Not returned if a callback is given.
     */
    Constr.prototype.getFollowedArtists = function(options, callback) {
      var requestData = {
        url: _baseUri + '/me/following',
        type: 'GET',
        params: {
          type: 'artist'
        }
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Fetches information about a specific user.
     * See [Get a User's Profile](https://developer.spotify.com/web-api/get-users-profile/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} userId The id of the user. If you know the Spotify URI it is easy
     * to find the id (e.g. spotify:user:<here_is_the_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getUser = function(userId, options, callback) {
      var requestData = {
        url: _baseUri + '/users/' + encodeURIComponent(userId)
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Fetches a list of the current user's playlists.
     * See [Get a List of a User's Playlists](https://developer.spotify.com/web-api/get-list-users-playlists/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} userId An optional id of the user. If you know the Spotify URI it is easy
     * to find the id (e.g. spotify:user:<here_is_the_id>). If not provided, the id of the user that granted
     * the permissions will be used.
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getUserPlaylists = function(userId, options, callback) {
      var requestData;
      if (typeof userId === 'string') {
        requestData = {
          url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists'
        };
      } else {
        requestData = {
          url: _baseUri + '/me/playlists'
        };
        callback = options;
        options = userId;
      }
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Fetches a specific playlist.
     * See [Get a Playlist](https://developer.spotify.com/web-api/get-playlist/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
     * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getPlaylist = function(playlistId, options, callback) {
      var requestData = {
        url: _baseUri + '/playlists/' + playlistId
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Fetches the tracks from a specific playlist.
     * See [Get a Playlist's Tracks](https://developer.spotify.com/web-api/get-playlists-tracks/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
     * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getPlaylistTracks = function(playlistId, options, callback) {
      var requestData = {
        url: _baseUri + '/playlists/' + playlistId + '/tracks'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Creates a playlist and stores it in the current user's library.
     * See [Create a Playlist](https://developer.spotify.com/web-api/create-playlist/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} userId The id of the user. If you know the Spotify URI it is easy
     * to find the id (e.g. spotify:user:<here_is_the_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.createPlaylist = function(userId, options, callback) {
      var requestData = {
        url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists',
        type: 'POST',
        postData: options
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Change a playlist's name and public/private state
     * See [Change a Playlist's Details](https://developer.spotify.com/web-api/change-playlist-details/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
     * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
     * @param {Object} data A JSON object with the data to update. E.g. {name: 'A new name', public: true}
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.changePlaylistDetails = function(playlistId, data, callback) {
      var requestData = {
        url: _baseUri + '/playlists/' + playlistId,
        type: 'PUT',
        postData: data
      };
      return _checkParamsAndPerformRequest(requestData, data, callback);
    };
  
    /**
     * Add tracks to a playlist.
     * See [Add Tracks to a Playlist](https://developer.spotify.com/web-api/add-tracks-to-playlist/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
     * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
     * @param {Array<string>} uris An array of Spotify URIs for the tracks
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.addTracksToPlaylist = function(playlistId, uris, options, callback) {
      var requestData = {
        url: _baseUri + '/playlists/' + playlistId + '/tracks',
        type: 'POST',
        postData: {
          uris: uris
        }
      };
      return _checkParamsAndPerformRequest(requestData, options, callback, true);
    };
  
    /**
     * Replace the tracks of a playlist
     * See [Replace a Playlist's Tracks](https://developer.spotify.com/web-api/replace-playlists-tracks/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
     * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
     * @param {Array<string>} uris An array of Spotify URIs for the tracks
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.replaceTracksInPlaylist = function(playlistId, uris, callback) {
      var requestData = {
        url: _baseUri + '/playlists/' + playlistId + '/tracks',
        type: 'PUT',
        postData: { uris: uris }
      };
      return _checkParamsAndPerformRequest(requestData, {}, callback);
    };
  
    /**
     * Reorder tracks in a playlist
     * See [Reorder a Playlist’s Tracks](https://developer.spotify.com/web-api/reorder-playlists-tracks/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
     * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
     * @param {number} rangeStart The position of the first track to be reordered.
     * @param {number} insertBefore The position where the tracks should be inserted. To reorder the tracks to
     * the end of the playlist, simply set insert_before to the position after the last track.
     * @param {Object} options An object with optional parameters (range_length, snapshot_id)
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.reorderTracksInPlaylist = function(playlistId, rangeStart, insertBefore, options, callback) {
      /* eslint-disable camelcase */
      var requestData = {
        url: _baseUri + '/playlists/' + playlistId + '/tracks',
        type: 'PUT',
        postData: {
          range_start: rangeStart,
          insert_before: insertBefore
        }
      };
      /* eslint-enable camelcase */
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Remove tracks from a playlist
     * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
     * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
     * @param {Array<Object>} uris An array of tracks to be removed. Each element of the array can be either a
     * string, in which case it is treated as a URI, or an object containing the properties `uri` (which is a
     * string) and `positions` (which is an array of integers).
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.removeTracksFromPlaylist = function(playlistId, uris, callback) {
      var dataToBeSent = uris.map(function(uri) {
        if (typeof uri === 'string') {
          return { uri: uri };
        } else {
          return uri;
        }
      });
  
      var requestData = {
        url: _baseUri + '/playlists/' + playlistId + '/tracks',
        type: 'DELETE',
        postData: { tracks: dataToBeSent }
      };
      return _checkParamsAndPerformRequest(requestData, {}, callback);
    };
  
    /**
     * Remove tracks from a playlist, specifying a snapshot id.
     * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
     * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
     * @param {Array<Object>} uris An array of tracks to be removed. Each element of the array can be either a
     * string, in which case it is treated as a URI, or an object containing the properties `uri` (which is a
     * string) and `positions` (which is an array of integers).
     * @param {string} snapshotId The playlist's snapshot ID against which you want to make the changes
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.removeTracksFromPlaylistWithSnapshotId = function(playlistId, uris, snapshotId, callback) {
      var dataToBeSent = uris.map(function(uri) {
        if (typeof uri === 'string') {
          return { uri: uri };
        } else {
          return uri;
        }
      });
      /* eslint-disable camelcase */
      var requestData = {
        url: _baseUri + '/playlists/' + playlistId + '/tracks',
        type: 'DELETE',
        postData: {
          tracks: dataToBeSent,
          snapshot_id: snapshotId
        }
      };
      /* eslint-enable camelcase */
      return _checkParamsAndPerformRequest(requestData, {}, callback);
    };
  
    /**
     * Remove tracks from a playlist, specifying the positions of the tracks to be removed.
     * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
     * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
     * @param {Array<number>} positions array of integers containing the positions of the tracks to remove
     * from the playlist.
     * @param {string} snapshotId The playlist's snapshot ID against which you want to make the changes
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.removeTracksFromPlaylistInPositions = function(playlistId, positions, snapshotId, callback) {
      /* eslint-disable camelcase */
      var requestData = {
        url: _baseUri + '/playlists/' + playlistId + '/tracks',
        type: 'DELETE',
        postData: {
          positions: positions,
          snapshot_id: snapshotId
        }
      };
      /* eslint-enable camelcase */
      return _checkParamsAndPerformRequest(requestData, {}, callback);
    };
  
    /**
     * Upload a custom playlist cover image.
     * See [Upload A Custom Playlist Cover Image](https://developer.spotify.com/web-api/upload-a-custom-playlist-cover-image/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
     * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
     * @param {string} imageData Base64 encoded JPEG image data, maximum payload size is 256 KB.
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.uploadCustomPlaylistCoverImage = function(playlistId, imageData, callback) {
      var requestData = {
        url: _baseUri + '/playlists/' + playlistId + '/images',
        type: 'PUT',
        postData: imageData.replace(/^data:image\/jpeg;base64,/, ''),
        contentType: 'image/jpeg'
      };
      return _checkParamsAndPerformRequest(requestData, {}, callback);
    };
  
    /**
     * Fetches an album from the Spotify catalog.
     * See [Get an Album](https://developer.spotify.com/web-api/get-album/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} albumId The id of the album. If you know the Spotify URI it is easy
     * to find the album id (e.g. spotify:album:<here_is_the_album_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getAlbum = function(albumId, options, callback) {
      var requestData = {
        url: _baseUri + '/albums/' + albumId
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Fetches the tracks of an album from the Spotify catalog.
     * See [Get an Album's Tracks](https://developer.spotify.com/web-api/get-albums-tracks/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} albumId The id of the album. If you know the Spotify URI it is easy
     * to find the album id (e.g. spotify:album:<here_is_the_album_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getAlbumTracks = function(albumId, options, callback) {
      var requestData = {
        url: _baseUri + '/albums/' + albumId + '/tracks'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Fetches multiple albums from the Spotify catalog.
     * See [Get Several Albums](https://developer.spotify.com/web-api/get-several-albums/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI it is easy
     * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getAlbums = function(albumIds, options, callback) {
      var requestData = {
        url: _baseUri + '/albums/',
        params: { ids: albumIds.join(',') }
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Fetches a track from the Spotify catalog.
     * See [Get a Track](https://developer.spotify.com/web-api/get-track/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
     * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getTrack = function(trackId, options, callback) {
      var requestData = {};
      requestData.url = _baseUri + '/tracks/' + trackId;
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Fetches multiple tracks from the Spotify catalog.
     * See [Get Several Tracks](https://developer.spotify.com/web-api/get-several-tracks/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
     * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getTracks = function(trackIds, options, callback) {
      var requestData = {
        url: _baseUri + '/tracks/',
        params: { ids: trackIds.join(',') }
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Fetches an artist from the Spotify catalog.
     * See [Get an Artist](https://developer.spotify.com/web-api/get-artist/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
     * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getArtist = function(artistId, options, callback) {
      var requestData = {
        url: _baseUri + '/artists/' + artistId
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Fetches multiple artists from the Spotify catalog.
     * See [Get Several Artists](https://developer.spotify.com/web-api/get-several-artists/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
     * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getArtists = function(artistIds, options, callback) {
      var requestData = {
        url: _baseUri + '/artists/',
        params: { ids: artistIds.join(',') }
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Fetches the albums of an artist from the Spotify catalog.
     * See [Get an Artist's Albums](https://developer.spotify.com/web-api/get-artists-albums/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
     * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getArtistAlbums = function(artistId, options, callback) {
      var requestData = {
        url: _baseUri + '/artists/' + artistId + '/albums'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Fetches a list of top tracks of an artist from the Spotify catalog, for a specific country.
     * See [Get an Artist's Top Tracks](https://developer.spotify.com/web-api/get-artists-top-tracks/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
     * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
     * @param {string} countryId The id of the country (e.g. ES for Spain or US for United States)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getArtistTopTracks = function(artistId, countryId, options, callback) {
      var requestData = {
        url: _baseUri + '/artists/' + artistId + '/top-tracks',
        params: { country: countryId }
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Fetches a list of artists related with a given one from the Spotify catalog.
     * See [Get an Artist's Related Artists](https://developer.spotify.com/web-api/get-related-artists/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
     * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getArtistRelatedArtists = function(artistId, options, callback) {
      var requestData = {
        url: _baseUri + '/artists/' + artistId + '/related-artists'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Fetches a list of Spotify featured playlists (shown, for example, on a Spotify player's "Browse" tab).
     * See [Get a List of Featured Playlists](https://developer.spotify.com/web-api/get-list-featured-playlists/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getFeaturedPlaylists = function(options, callback) {
      var requestData = {
        url: _baseUri + '/browse/featured-playlists'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Fetches a list of new album releases featured in Spotify (shown, for example, on a Spotify player's "Browse" tab).
     * See [Get a List of New Releases](https://developer.spotify.com/web-api/get-list-new-releases/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getNewReleases = function(options, callback) {
      var requestData = {
        url: _baseUri + '/browse/new-releases'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Get a list of categories used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
     * See [Get a List of Categories](https://developer.spotify.com/web-api/get-list-categories/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getCategories = function(options, callback) {
      var requestData = {
        url: _baseUri + '/browse/categories'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Get a single category used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
     * See [Get a Category](https://developer.spotify.com/web-api/get-category/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} categoryId The id of the category. These can be found with the getCategories function
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getCategory = function(categoryId, options, callback) {
      var requestData = {
        url: _baseUri + '/browse/categories/' + categoryId
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Get a list of Spotify playlists tagged with a particular category.
     * See [Get a Category's Playlists](https://developer.spotify.com/web-api/get-categorys-playlists/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} categoryId The id of the category. These can be found with the getCategories function
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getCategoryPlaylists = function(categoryId, options, callback) {
      var requestData = {
        url: _baseUri + '/browse/categories/' + categoryId + '/playlists'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Get Spotify catalog information about artists, albums, tracks or playlists that match a keyword string.
     * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} query The search query
     * @param {Array<string>} types An array of item types to search across.
     * Valid types are: 'album', 'artist', 'playlist', and 'track'.
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.search = function(query, types, options, callback) {
      var requestData = {
        url: _baseUri + '/search/',
        params: {
          q: query,
          type: types.join(',')
        }
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Fetches albums from the Spotify catalog according to a query.
     * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} query The search query
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.searchAlbums = function(query, options, callback) {
      return this.search(query, ['album'], options, callback);
    };
  
    /**
     * Fetches artists from the Spotify catalog according to a query.
     * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} query The search query
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.searchArtists = function(query, options, callback) {
      return this.search(query, ['artist'], options, callback);
    };
  
    /**
     * Fetches tracks from the Spotify catalog according to a query.
     * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} query The search query
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.searchTracks = function(query, options, callback) {
      return this.search(query, ['track'], options, callback);
    };
  
    /**
     * Fetches playlists from the Spotify catalog according to a query.
     * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} query The search query
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.searchPlaylists = function(query, options, callback) {
      return this.search(query, ['playlist'], options, callback);
    };
  
    /**
     * Get audio features for a single track identified by its unique Spotify ID.
     * See [Get Audio Features for a Track](https://developer.spotify.com/web-api/get-audio-features/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
     * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getAudioFeaturesForTrack = function(trackId, callback) {
      var requestData = {};
      requestData.url = _baseUri + '/audio-features/' + trackId;
      return _checkParamsAndPerformRequest(requestData, {}, callback);
    };
  
    /**
     * Get audio features for multiple tracks based on their Spotify IDs.
     * See [Get Audio Features for Several Tracks](https://developer.spotify.com/web-api/get-several-audio-features/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
     * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getAudioFeaturesForTracks = function(trackIds, callback) {
      var requestData = {
        url: _baseUri + '/audio-features',
        params: { ids: trackIds }
      };
      return _checkParamsAndPerformRequest(requestData, {}, callback);
    };
  
    /**
     * Get audio analysis for a single track identified by its unique Spotify ID.
     * See [Get Audio Analysis for a Track](https://developer.spotify.com/web-api/get-audio-analysis/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
     * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getAudioAnalysisForTrack = function(trackId, callback) {
      var requestData = {};
      requestData.url = _baseUri + '/audio-analysis/' + trackId;
      return _checkParamsAndPerformRequest(requestData, {}, callback);
    };
  
    /**
     * Create a playlist-style listening experience based on seed artists, tracks and genres.
     * See [Get Recommendations Based on Seeds](https://developer.spotify.com/web-api/get-recommendations/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Object} options A JSON object with options that can be passed
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getRecommendations = function(options, callback) {
      var requestData = {
        url: _baseUri + '/recommendations'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Retrieve a list of available genres seed parameter values for recommendations.
     * See [Available Genre Seeds](https://developer.spotify.com/web-api/get-recommendations/#available-genre-seeds) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getAvailableGenreSeeds = function(callback) {
      var requestData = {
        url: _baseUri + '/recommendations/available-genre-seeds'
      };
      return _checkParamsAndPerformRequest(requestData, {}, callback);
    };
  
    /**
     * Get information about a user’s available devices.
     * See [Get a User’s Available Devices](https://developer.spotify.com/web-api/get-a-users-available-devices/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getMyDevices = function(callback) {
      var requestData = {
        url: _baseUri + '/me/player/devices'
      };
      return _checkParamsAndPerformRequest(requestData, {}, callback);
    };
  
    /**
     * Get information about the user’s current playback state, including track, track progress, and active device.
     * See [Get Information About The User’s Current Playback](https://developer.spotify.com/web-api/get-information-about-the-users-current-playback/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Object} options A JSON object with options that can be passed.
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getMyCurrentPlaybackState = function(options, callback) {
      var requestData = {
        url: _baseUri + '/me/player'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Get the object currently being played on the user’s Spotify account.
     * See [Get the User’s Currently Playing Track](https://developer.spotify.com/web-api/get-the-users-currently-playing-track/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Object} options A JSON object with options that can be passed.
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.getMyCurrentPlayingTrack = function(options, callback) {
      var requestData = {
        url: _baseUri + '/me/player/currently-playing'
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Transfer playback to a new device and determine if it should start playing.
     * See [Transfer a User’s Playback](https://developer.spotify.com/web-api/transfer-a-users-playback/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Array<string>} deviceIds A JSON array containing the ID of the device on which playback should be started/transferred.
     * @param {Object} options A JSON object with options that can be passed.
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.transferMyPlayback = function(deviceIds, options, callback) {
      var postData = options || {};
      postData.device_ids = deviceIds;
      var requestData = {
        type: 'PUT',
        url: _baseUri + '/me/player',
        postData: postData
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Start a new context or resume current playback on the user’s active device.
     * See [Start/Resume a User’s Playback](https://developer.spotify.com/web-api/start-a-users-playback/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Object} options A JSON object with options that can be passed.
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.play = function(options, callback) {
      options = options || {};
      var params = 'device_id' in options ? {device_id: options.device_id} : null;
      var postData = {};
      ['context_uri', 'uris', 'offset', 'position_ms'].forEach(function(field) {
        if (field in options) {
          postData[field] = options[field];
        }
      });
      var requestData = {
        type: 'PUT',
        url: _baseUri + '/me/player/play',
        params: params,
        postData: postData
      };
  
      // need to clear options so it doesn't add all of them to the query params
      var newOptions = typeof options === 'function' ? options : {};
      return _checkParamsAndPerformRequest(requestData, newOptions, callback);
    };
  
    /**
     * Pause playback on the user’s account.
     * See [Pause a User’s Playback](https://developer.spotify.com/web-api/pause-a-users-playback/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Object} options A JSON object with options that can be passed.
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.pause = function(options, callback) {
      options = options || {};
      var params = 'device_id' in options ? {device_id: options.device_id} : null;
      var requestData = {
        type: 'PUT',
        url: _baseUri + '/me/player/pause',
        params: params
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Skips to next track in the user’s queue.
     * See [Skip User’s Playback To Next Track](https://developer.spotify.com/web-api/skip-users-playback-to-next-track/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Object} options A JSON object with options that can be passed.
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.skipToNext = function(options, callback) {
      options = options || {};
      var params = 'device_id' in options ? {device_id: options.device_id} : null;
      var requestData = {
        type: 'POST',
        url: _baseUri + '/me/player/next',
        params: params
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Skips to previous track in the user’s queue.
     * Note that this will ALWAYS skip to the previous track, regardless of the current track’s progress.
     * Returning to the start of the current track should be performed using `.seek()`
     * See [Skip User’s Playback To Previous Track](https://developer.spotify.com/web-api/skip-users-playback-to-next-track/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {Object} options A JSON object with options that can be passed.
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.skipToPrevious = function(options, callback) {
      options = options || {};
      var params = 'device_id' in options ? {device_id: options.device_id} : null;
      var requestData = {
        type: 'POST',
        url: _baseUri + '/me/player/previous',
        params: params
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Seeks to the given position in the user’s currently playing track.
     * See [Seek To Position In Currently Playing Track](https://developer.spotify.com/web-api/seek-to-position-in-currently-playing-track/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {number} position_ms The position in milliseconds to seek to. Must be a positive number.
     * @param {Object} options A JSON object with options that can be passed.
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.seek = function(position_ms, options, callback) {
      options = options || {};
      var params = {
        position_ms: position_ms
      };
      if ('device_id' in options) {
        params.device_id = options.device_id;
      }
      var requestData = {
        type: 'PUT',
        url: _baseUri + '/me/player/seek',
        params: params
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Set the repeat mode for the user’s playback. Options are repeat-track, repeat-context, and off.
     * See [Set Repeat Mode On User’s Playback](https://developer.spotify.com/web-api/set-repeat-mode-on-users-playback/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {String} state A string set to 'track', 'context' or 'off'.
     * @param {Object} options A JSON object with options that can be passed.
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.setRepeat = function(state, options, callback) {
      options = options || {};
      var params = {
        state: state
      };
      if ('device_id' in options) {
        params.device_id = options.device_id;
      }
      var requestData = {
        type: 'PUT',
        url: _baseUri + '/me/player/repeat',
        params: params
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Set the volume for the user’s current playback device.
     * See [Set Volume For User’s Playback](https://developer.spotify.com/web-api/set-volume-for-users-playback/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {number} volume_percent The volume to set. Must be a value from 0 to 100 inclusive.
     * @param {Object} options A JSON object with options that can be passed.
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.setVolume = function(volume_percent, options, callback) {
      options = options || {};
      var params = {
        volume_percent: volume_percent
      };
      if ('device_id' in options) {
        params.device_id = options.device_id;
      }
      var requestData = {
        type: 'PUT',
        url: _baseUri + '/me/player/volume',
        params: params
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Toggle shuffle on or off for user’s playback.
     * See [Toggle Shuffle For User’s Playback](https://developer.spotify.com/web-api/toggle-shuffle-for-users-playback/) on
     * the Spotify Developer site for more information about the endpoint.
     *
     * @param {bool} state Whether or not to shuffle user's playback.
     * @param {Object} options A JSON object with options that can be passed.
     * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
     * one is the error object (null if no error), and the second is the value if the request succeeded.
     * @return {Object} Null if a callback is provided, a `Promise` object otherwise
     */
    Constr.prototype.setShuffle = function(state, options, callback) {
      options = options || {};
      var params = {
        state: state
      };
      if ('device_id' in options) {
        params.device_id = options.device_id;
      }
      var requestData = {
        type: 'PUT',
        url: _baseUri + '/me/player/shuffle',
        params: params
      };
      return _checkParamsAndPerformRequest(requestData, options, callback);
    };
  
    /**
     * Gets the access token in use.
     *
     * @return {string} accessToken The access token
     */
    Constr.prototype.getAccessToken = function() {
      return _accessToken;
    };
  
    /**
     * Sets the access token to be used.
     * See [the Authorization Guide](https://developer.spotify.com/web-api/authorization-guide/) on
     * the Spotify Developer site for more information about obtaining an access token.
     *
     * @param {string} accessToken The access token
     * @return {void}
     */
    Constr.prototype.setAccessToken = function(accessToken) {
      _accessToken = accessToken;
    };
  
    /**
     * Sets an implementation of Promises/A+ to be used. E.g. Q, when.
     * See [Conformant Implementations](https://github.com/promises-aplus/promises-spec/blob/master/implementations.md)
     * for a list of some available options
     *
     * @param {Object} PromiseImplementation A Promises/A+ valid implementation
     * @throws {Error} If the implementation being set doesn't conform with Promises/A+
     * @return {void}
     */
    Constr.prototype.setPromiseImplementation = function(PromiseImplementation) {
      var valid = false;
      try {
        var p = new PromiseImplementation(function(resolve) {
          resolve();
        });
        if (typeof p.then === 'function' && typeof p.catch === 'function') {
          valid = true;
        }
      } catch (e) {
        console.error(e);
      }
      if (valid) {
        _promiseImplementation = PromiseImplementation;
      } else {
        throw new Error('Unsupported implementation of Promises/A+');
      }
    };
  
    return Constr;
  })();
  
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = SpotifyWebApi;
  }
  
  },{}],4:[function(require,module,exports){
  (function (process){
  /* 
  (The MIT License)
  Copyright (c) 2014-2019 Halász Ádám <mail@adamhalasz.com>
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */
  
  //  Unique Hexatridecimal ID Generator
  // ================================================
  
  //  Dependencies
  // ================================================
  var pid = process && process.pid ? process.pid.toString(36) : '' ;
  var address = '';
  if(typeof __webpack_require__ !== 'function'){
      var mac = '', networkInterfaces = require('os').networkInterfaces();
      for(let interface_key in networkInterfaces){
          const networkInterface = networkInterfaces[interface_key];
          const length = networkInterface.length;
          for(var i = 0; i < length; i++){
              if(networkInterface[i].mac && networkInterface[i].mac != '00:00:00:00:00:00'){
                  mac = networkInterface[i].mac; break;
              }
          }
      }
      address = mac ? parseInt(mac.replace(/\:|\D+/gi, '')).toString(36) : '' ;
  } 
  
  //  Exports
  // ================================================
  module.exports = module.exports.default = function(prefix, suffix){ return (prefix ? prefix : '') + address + pid + now().toString(36) + (suffix ? suffix : ''); }
  module.exports.process = function(prefix, suffix){ return (prefix ? prefix : '') + pid + now().toString(36) + (suffix ? suffix : ''); }
  module.exports.time    = function(prefix, suffix){ return (prefix ? prefix : '') + now().toString(36) + (suffix ? suffix : ''); }
  
  //  Helpers
  // ================================================
  function now(){
      var time = Date.now();
      var last = now.last || time;
      return now.last = time > last ? time : last + 1;
  }
  
  }).call(this,require('_process'))
  },{"_process":2,"os":1}],5:[function(require,module,exports){
  const uniqid = require('uniqid');
  
  window.alert('Kichul Kang');
  
  let asd = '';
  let show = '';
  
  fetch('https://webaim.org/resources/contrastchecker/?fcolor=62F500&bcolor=B42D60&api')
    .then((response) => {
      return response.json();
    })
  .then((myJson) => {
      console.log(JSON.stringify(myJson));
      asd = myJson.ratio;
      //document.getElementById("second").innerHTML = asd;
   }); //Testing json file with a random api
  
  var Spotify = require('spotify-web-api-js'); //bundle from spotify js
  var s = new Spotify();
  
  var SpotifyWebApi = require('spotify-web-api-js'); //bundle from spotify js
  var spotifyApi = new SpotifyWebApi();
  
  var accessToken = 'BQCtTuuydJc8bbltTqN2ZcWzL3AI5h8ExwMHrcI1kh7-tmrwofINB2UhdQt0J8lluFnOO6B6IlE3VzAAIBJwRuRfmEg3Oi4VPiIZiCgppThIbA6ymDdHEPjNVo52Kyfox_ku1CDKiJ--qco3Uz7_QYTL8GXIxr7TEoPwge8';
  spotifyApi.setAccessToken(accessToken); //put access token here
  
  /* Below add to artists of the user and their top songs (30 songs total) */   
  /* Emotions */
  const energetic = [0.85, 0.9, 1.0];
  const excited = [0.85, 0.6, 0.7];
  const angry = [0.1, 0.3, 0.8];
  const joyful = [0.9, 0.5, 0.5];
  const calm = [0.6, 0.1, 0.1];
  const sad = [0.1, 0.1, 0.3];
  const average_emotion = [0.7, 0.7, 0.7];
  
  var songURIarray = [];
  var songIDarray = [];
  var top_artistsID_array = [];
  var song_final_URI_array = [];
  var song_final_ID_array = [];
  
  
  var userID = '225ysiku3qlbuhu5apc3rtj5q'; //user ID
  var emotion_nameOfPlaylist = "Mood Swing Playlist"; //emotion chosen
  var playListID;
  var playListIDstring;
  
  /* create playlist function*/
  
  window.logData = function(){
  spotifyApi.createPlaylist(userID, {name: emotion_nameOfPlaylist, public: true})
      .then(function(data) {
        console.log('Create playlist', data);
        playListID = data.id;
        console.log(playListID);
        playListIDstring = "https://open.spotify.com/embed/playlist/" + playListID;
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
        for (var t = 0; t < 50; t++) {
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
              if (v <= 0.3 && d <= 0.3 && e <= 0.3) {
                addplaylist(userID, data.uri, playListID, accessToken);
                console.log('this song has been added; uri=', data.uri)
              }
            });
        }     //loops over the song_final_URI array and checks if it should be added to the playlist
        
        $('#iframe').attr("src", playListIDstring);
        $('#iframe').attr("height", "100%");
        $('#iframe').attr("width", "100%");
        $('#iframe').attr("allow", "encrypted-media");
  
      }, 10000);
      }, function(err) {
        console.error(err);
      }); //this creates songURIarray and adds them to the list
    };
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
  
  },{"spotify-web-api-js":3,"uniqid":4}]},{},[5]);
  