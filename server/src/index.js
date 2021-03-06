var server = require("./server");
var router = require("./router");
var watchdog_util = require("./watchdog-util");

var data_file_root = "../data/";
var requestHandler = require("./requestHandler");
var dataSource = require("./dataSource");
var fs = require('fs');
// auth
var userUtils = require( './userUtils');
//email module
var email_module = require('./email');

var  Handle = {};
Handle['/query'] = requestHandler.query;
Handle['/verify'] = userUtils.verify;

global.user_list = JSON.parse(fs.readFileSync(data_file_root+'user.json', 'utf8'));
global.term_list = JSON.parse(fs.readFileSync(data_file_root+'term.json', 'utf8'));
global.config = JSON.parse(fs.readFileSync(data_file_root+'conf.json', 'utf8'));
global.pool = {};
global.pool.calander = JSON.parse(fs.readFileSync(data_file_root+'pool.calander.json', 'utf8'));

dataSource.start();

//var test = watchdog_util.poll("email","calander");
//console.log("%j",test);
//console.log(email_module.send(email_module.merge_mail(test)));
email_module.start();

server.start( router.route, Handle);
