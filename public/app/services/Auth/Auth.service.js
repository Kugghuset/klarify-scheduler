(function () {
'use strict'

angular.module('klarifyApp')
.factory('Auth', ['$http', '$q', '$cookies', function ($http, $q, $cookies) {
  var _user;
  
  return {
    
    /**
     * Returns true or false for whether there is a cookie
     * stored as token.
     * 
     * @return {Boolean}
     */
    isLoggedIn: function () {
      return !!$cookies.get('token');
    },
    
    /**
     * Returns true or false for whether there is a token,
     * which probably means there is a user.
     * 
     * If there is a token, it runs getMe to populate it.
     * 
     * @return {Promise} -> {Boolean}
     */
    isLoggedInAsync: function () {
      return $q(function (resolve, reject) {
        if ($cookies.get('token')) {
          // Enough for transition to progress
          resolve(true);
          
          // Populate user here
        } else {
          _user = {};
          resolve(false);
        }
      });
    },
    /**
     * Gets the local user.
     * 
     * @return {Objec} (User)
     */
    getCurrentUser: function () {
      return _user;
    },
    
    /**
     * Sets _user to empty
     * and removes the token from cookies.
     */
    logout: function () {
      _user = {}; // There is no concept of user yet, though
      $cookies.remove('token');
    }
  }
}]);

})();