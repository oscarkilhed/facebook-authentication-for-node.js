var querystring = require('querystring');
var https = require('https');

/*
fb object:

{
  appId : your_app_id,
  redirectURI : the_uri_you_ask_facebook_to_redirect_to,
  appSecrett : your_app_secret,
  oauthHOST : 'graph.facebook.com'
}
*/


//callback parameters: error, facebookUserJson
exports.getFacebookUser = function(fb, accessToken, callback){
  
  var tokenURL = '/oauth/access_token?' +
    'client_id=' + fb.appId +
    '&redirect_uri=' + querystring.escape(fb.redirectURI) +
    '&client_secret=' + fb.appSecret +
    '&code=' + accessToken;
    
  var options = {
    host: fb.oauthHOST,
    path: tokenURL
  }

  https.get(options, function(oauthRes){
  
    var facebookData = '';
    oauthRes.on('data', function(data){
      facebookData += data;
    });
  
    oauthRes.on('end', function(){
      var graphURL = '/me?' + facebookData;
      https.get({host: fb.oauthHOST, path: graphURL }, function(graphResponse){
        graphResponse.on('data', function(data){
          callback(null, JSON.parse(data));
        });
      });  
    });
  
  }).on('error', function(e){
    callback(e);
  });
}
