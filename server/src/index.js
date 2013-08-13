var server = require("./server");
var router = require("./router");
var watchdog_util = require("./watchdog-util");
var http = require("http");
var data_file_root = "../data/";
var HashMap = require('hashmap').HashMap;
var cornJob = require('cron').CronJob;
var requestHandler = require("./requestHandler");
var fs = require('fs');

// auth
var userUtils = require( './userUtils');

function dateToYMD(date) {
	var d = date.getDate();
	var m = date.getMonth() + 1;
	var y = date.getFullYear();
	return '' + y  + (m<=9 ? '0' + m : m) + (d <= 9 ? '0' + d : d);
}
function parseYMD(str) {
	if(!/^(\d){8}$/.test(str)) return "invalid date";
	var y = str.substr(0,4),
		m = str.substr(4,2),
		  d = str.substr(6,2);
	return new Date(y,m-1,d);
}
var  Handle = {};
Handle['/query'] = requestHandler.query;
Handle['/verify'] = userUtils.verify;

global.user_list = JSON.parse(fs.readFileSync(data_file_root+'user.json', 'utf8'));
global.term_list = JSON.parse(fs.readFileSync(data_file_root+'term.json', 'utf8'));
global.config = JSON.parse(fs.readFileSync(data_file_root+'conf.json', 'utf8'));
global.pool = {};
global.pool.calander = JSON.parse(fs.readFileSync(data_file_root+'pool.calander.json', 'utf8'));
var check_calander = new cornJob('* * * * *',function(){
	console.log("check calander");
	var option = {
		host: global.config.data_source['calander']['host'],
		port: 80,
		path: global.config.data_source['calander']['path']
	};
	var reply = '';
	var reqGet = http.request(option, function(res) {
		//console.log("statusCode: ", res.statusCode);
		// uncomment it for header details
		//  console.log("headers: ", res.headers);
		res.on('data', function(data) {
			reply += data;
		});
		res.on('end',function(){
			try{
				reply = JSON.parse(reply);
			}catch(e){
				console.log('calander parse error:' e);
				return;
			}
			//console.log(reply);
			var calander_last_id = global.config.pool_status['calander']['last_id'];
			for(var key in reply.entries)
			{
				//console.log(reply.entries[key]['id']+','+global.config['calander_last_id']);
				if(reply.entries[key]['id']>global.config.pool_status['calander']['last_id'])
				{
					global.pool['calander'].push(reply.entries[key]);
					//console.log(reply.entries[key]);
					if(reply.entries[key]['id']>calander_last_id)
					{
						calander_last_id = reply.entries[key]['id'];
					}
				}
			}
			if(global.config.pool_status['calander']['last_id'] == calander_last_id)
			{
				console.log("no change");
			}
			else
			{
				global.config.pool_status['calander']['last_id'] = calander_last_id;
				console.log("updated, last calander id: "+ calander_last_id);
				watchdog_util.sync(data_file_root);
			}
		});
	});
	reqGet.end();
	reqGet.on('error', function(e) {
		console.error(e);
	});
});
check_calander.start();

server.start( router.route, Handle);
