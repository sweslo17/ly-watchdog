var wd_util = require("./watchdog-util");

function verify_user( req) {

	var user_data = {};
	var json = {
		"provider" : [],
		"name" : req['name'],
		"term_list" : [],
		"auth_token" : req['token']
	};
	user_data = wd_util.get_user( req['mail'], req['token']);
	if( undefined === user_data.length) {
		user_data = wd_util.update_user( req['mail'], json);
	}

	return user_data;
}

exports.verify = verify_user;
