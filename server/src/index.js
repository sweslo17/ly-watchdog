var server = require("./server");
var router = require("./router");
var watchdog_util = require("./watchdog-util");
//var test2 = require("./test2"); 
global.test = 5;
//util.test();
//util.print("aaa");
//test2.test();
//test2.print("bbb");
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
	//console.log(str);
	if(!/^(\d){8}$/.test(str)) return "invalid date";
	var y = str.substr(0,4),
		m = str.substr(4,2),
		  d = str.substr(6,2);
	//console.log(y+','+m+','+d)
	return new Date(y,m-1,d);
}
function sync(){
	fs.writeFile(data_file_root+'conf.json',JSON.stringify(global.config,undefined,2),function(err){
		if(err){
			console.log('conf sync error');
		}else{
			console.log('conf sync success');
		}
	});
	fs.writeFile(data_file_root+'pool.calander.json',JSON.stringify(global.pool.calander,undefined,2),function(err){
		if(err){
			console.log('calander_pool sync error');
		}else{
			console.log('calander_pool sync success');
		}
	});
}
var  Handle = {};
Handle['/query'] = requestHandler.query;
Handle['/verify'] = userUtils.verify;

//Handle['/get_stat'] = requestHandler.get_stat;
global.user_list = JSON.parse(fs.readFileSync(data_file_root+'user.json', 'utf8'));
global.term_list = JSON.parse(fs.readFileSync(data_file_root+'term.json', 'utf8'));
global.config = JSON.parse(fs.readFileSync(data_file_root+'conf.json', 'utf8'));
//console.log(JSON.parse(fs.readFileSync(data_file_root+'pool.calander.json', 'utf8'))); 
global.pool = {};
global.pool.calander = JSON.parse(fs.readFileSync(data_file_root+'pool.calander.json', 'utf8'));
//watchdog_util.add_term("sweslo17@gmail.com","abc");
//watchdog_util.remove_term("sweslo17@gmail.com","洪仲丘");
//console.log(JSON.stringify(global.user_list));
//console.log(JSON.stringify(global.term_list));
//console.log(JSON.stringify(watchdog_util.poll("email","calander"),undefined,4));
//console.log("%j",global.config);
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
			//console.info('GET result:\n');
			reply += data;
			//process.stdout.write(d);
			//console.info('\n\nCall completed');
		});
		res.on('end',function(){
			reply = JSON.parse(reply);
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
				sync();
			}
			//console.log(global.calander_pool);
			//console.log(global.config);
		});
	});
	reqGet.end();
	reqGet.on('error', function(e) {
		console.error(e);
	});
	//console.log("test");
});
check_calander.start();

server.start( router.route, Handle);
