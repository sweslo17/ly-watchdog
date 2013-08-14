var nodemailer = require("nodemailer");
var secret = require('./secret');
var watchdog_util = require('./watchdog-util');
var cornJob = require('cron').CronJob;
var mailer;
function start()
{
	mailer = nodemailer.createTransport("SMTP",{
		service: "Gmail",
		auth: {
			user: secret.mailID,
		pass: secret.mailPass
		}
	});
	var emailJob = new cornJob('*/5 * * * *',function(){
		var send_list = watchdog_util.poll('email','calander');
		console.log('email module called');
		console.log("%j",send_list);
	});
	emailJob.start();
}
function send()
{
	mailer.sendMail({
		from: "g0v立院看門狗<ly.watchdog@gmail.com>",
		to: "sweslo17 <sweslo17@gmail.com>, lywatch <ly.watchdog@gmail.com>", // comma separated list of receivers
		subject: "Hello", // Subject line
		text: "Hello world" // plaintext body
	}, function(error, response){
		if(error){
			console.log(error);
		}else{
			console.log("Message sent: " + response.message);
		}
	});
}
exports.start = start;
