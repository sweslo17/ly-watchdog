var cornJob = require('cron').CronJob;
var http = require("http");
var watchdog_util = require("./watchdog-util");
var data_file_root = "../data/";
function start(){
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
					console.log('calander parse error: ' +e);
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
}
exports.start = start;
