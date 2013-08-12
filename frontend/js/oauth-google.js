var OAUTHURL    =   'https://accounts.google.com/o/oauth2/auth?';
var VALIDURL    =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
var SCOPE       =   'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
var CLIENTID    =   '1094265515407-au6lmsnru2ffd4ic95p5r19tk0h4d528.apps.googleusercontent.com';
var REDIRECT    =   'http://gaisk.cs.ccu.edu.tw/~yjt101/g0v/ly-watchdog/frontend/auth.html';
var LOGOUT      =   'http://accounts.google.com/Logout';
var TYPE        =   'token';
var _url        =   OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;
var acToken;
var tokenType;
var expiresIn;
var user;
var loggedIn    =   false;

function login() {

	var win         =   window.open(_url, "Google Authenticate", 'width=640, height=480'); 
	var pollTimer   =   window.setInterval(function() { 
		try {
			console.log(win.document.URL);
			if (win.document.URL.indexOf(REDIRECT) != -1) {
				window.clearInterval(pollTimer);
				var url =   win.document.URL;
				acToken =   gup(url, 'access_token');
				tokenType = gup(url, 'token_type');
				expiresIn = gup(url, 'expires_in');
				win.close();
				validateToken(acToken);
			}
		} 
		catch(e) {
			console.log( e);
		}
	}, 500);
}

function validateToken(token) {
	$.ajax({
		url: VALIDURL + token,
		data: null,
		success: function(responseText){  
			getUserInfo();
			loggedIn = true;
			$('#authorize-button').hide();
			$('#logout-button').show();
			setLocalAccount();
		},  
		dataType: "jsonp"  
	});
}

function getUserInfo() {
	$.ajax({
		url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + acToken,
		data: null,
		success: function(resp) {
			user    =   resp;
			console.log(user);
			$('#uName').text('Welcome ' + user.name);
			if( 'undefined' === typeof user.picture) 
				$('#uPic').attr('src', 'img/gplus-128.png');
			else 
				$('#uPic').attr('src', user.picture);
			$('#uHolder').show();
		},
		dataType: "jsonp"
	});
}

function setLocalAccount() {
	$.ajax({
		url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + acToken,
		data: null,
		dataType: "jsonp",
		success: function(resp) {
			user    =   resp;
			$.ajax( {
				url: 'http://gaisk.cs.ccu.edu.tw:8888/verify',
				data: {
					"mail" : user.email,
					"name" : user.name,
					"token" : user.id
				},
				dataType: 'json',
				success: function( res) {
					console.log( res);
				}
			});
		}
	});

}

//credits: http://www.netlobo.com/url_query_string_javascript.html
function gup(url, name) {
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\#&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( url );
	if( results == null )
		return "";
	else
		return results[1];
}

function startLogoutPolling() {
	$('#authorize-button').show();
	$('#logout-button').hide();
	loggedIn = false;
	$('#uHolder').hide();
}
