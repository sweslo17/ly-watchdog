var nodemailer = require("nodemailer");
var secret = require('./secret');
var watchdog_util = require('./watchdog-util');
var cornJob = require('cron').CronJob;
var mailer;
function start()
{
	console.log('email module start');
	mailer = nodemailer.createTransport("SMTP",{
		service: "Gmail",
		auth: {
			user: secret.mailID,
		pass: secret.mailPass
		}
	});
	var emailJob = new cornJob('*/2 * * * *',function(){
		var send_list = watchdog_util.poll('email','calander');
		send(merge_mail(send_list));
	}).start();
	//emailJob.start();
}
function send(send_list)
{//send email to user in send list
	//console.log(layout_mail(send_list));
	for(var user_key in send_list)
	{
		var count = 0;
		for(var term_key in send_list[user_key])
		{
			count += send_list[user_key][term_key].data.length;
		}
		mailer.sendMail({
			from: "g0v立院看門狗<ly.watchdog@gmail.com>",
		to: user_key, // comma separated list of receivers
		subject: "[立院看門狗]有"+count+'則新訊息', // Subject line
		html: layout_mail(send_list[user_key])
		}, function(error, response){
			if(error){
				console.log(error);
			}else{
				console.log("Message sent: " + response.message);
			}
		});
	}
}
function layout_mail(mail_term_list)
{//layout for each indivisual
	var text = '';
	for(var term_key in mail_term_list)
	{	
		text += '<h1>\n';
		text += mail_term_list[term_key].term + '\n';
		text += '</h1>\n';
		text += '<hr />\n'
		for(var data_key in mail_term_list[term_key].data)
		{
			text += '<ul>\n';
			text += '<li>日期：'+mail_term_list[term_key].data[data_key].date+'</li>\n';
			text += '<li>時間：'+mail_term_list[term_key].data[data_key].time+'</li>\n';
			text += '<li>名稱：<a href="http://www.ly.gov.tw/01_lyinfo/0109_meeting/meetingView.action?id='+mail_term_list[term_key].data[data_key].id+'">'+mail_term_list[term_key].data[data_key].name+'</a></li>\n';
			text += '<li>事由：'+mail_term_list[term_key].data[data_key].summary+'</li>\n';
			text += '</ul>\n';
		}
	}
	return text;
}
function merge_mail(send_list)
{//merge mail by user id from send list
	var output = {};
	for(var term_key in send_list)
	{
		var temp = {};
		for(var user_key in send_list[term_key].user_list)
		{
			if(output[send_list[term_key].user_list[user_key]] == undefined)
			{
				output[send_list[term_key].user_list[user_key]] = [];
			}
			temp['term'] = send_list[term_key]['term'];
			temp['data'] = send_list[term_key]['data'];
			output[send_list[term_key].user_list[user_key]].push(temp);
		}
	}
	return output;
}
exports.start = start;
exports.merge_mail = merge_mail;
exports.send = send;
