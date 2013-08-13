var fs = require('fs');
function add_term(user_id,term)
{
	if(global.term_list.term == undefined)
	{
		global.term_list[term] = {};
		global.term_list[term]['user_count'] = 0;
		global.term_list[term]['user_list'] = [];
	}
	global.term_list[term]['user_count']++;
	global.term_list[term]['user_list'].push(user_id);
	//console.log(global.user_list);
	console.log(user_id)
	global.user_list[user_id]['term_list'].push(term);
}
function remove_term(user_id,term)
{
	//global.term_list[term]
	for(var key in global.user_list[user_id]['term_list']){
		if(global.user_list[user_id]['term_list'][key] == term)
		{
			delete global.user_list[user_id]['term_list'][key];
			global.user_list[user_id]['term_list'].splice(key,1);
			break;
		}
	}
	for(var key in global.term_list[term]['user_list'])
	{
		if(global.term_list[term]['user_list'][key] == user_id)
		{
			delete global.term_list[term]['user_list'][key];
			global.term_list[term]['user_list'].splice(key,1);
			break;
		}
	}
}
function get_term(term)
{
	return global.term_list[term];
}
function update_user(user_id,profile)
{
	// initial
	output = {};
	// check out user exists
	if(global.user_list[user_id] == undefined) {
		global.user_list[user_id] = {};
		global.user_list[user_id] =  profile;
	}
	// set profile 
	// set output infomation 
	output['name'] = global.user_list[user_id]['name'];
	output['term_list'] = global.user_list[user_id]['term_list'];
	return output;
}
function get_user(user_id,token)
{
	var output = {};
	for(var user_key in global.user_list)
	{
		if(user_id == user_key && token == global.user_list[user_key].auth_token)
		{
			output['name'] = global.user_list[user_key].name;
			output['term_list'] = global.user_list[user_key].term_list;
			break;
		}
	}
	return output;
}
function poll(caller,datasource)
{
	var output = [];
	var last_id;
	if(global.config.module_status[caller]['update_status'][datasource]<global.config.pool_status[datasource]['last_id'])
	{
		//console.log(global.pool[datasource]);
		//for all new data
		for(var data_key in global.pool[datasource])
		{
			//console.log(data);
			//match all term
			if(global.config.module_status[caller]['update_status'][datasource]<global.config.pool_status[datasource]['last_id'])
			{
				for(term_key in global.term_list)
				{
					//console.log(data);
					if(global.pool[datasource][data_key].name.indexOf(term_key) != -1 || global.pool[datasource][data_key].summary.indexOf(term_key)!=-1)
					{
						var temp = {};
						temp['term'] = term_key;
						temp['user_list'] = [];
						for(user_key in global.term_list[term_key]['user_list'])
						{
							if(global.user_list[global.term_list[term_key]['user_list'][user_key]].provider != undefined)
							{
								for(provider_key in global.user_list[global.term_list[term_key]['user_list'][user_key]].provider)
								{
									if(caller == global.user_list[global.term_list[term_key]['user_list'][user_key]].provider[provider_key].name)
									{
										temp['user_list'].push(global.user_list[global.term_list[term_key]['user_list'][user_key]].provider[provider_key].id);
										//break;
									}
								}
							}
							/*else if(caller == "email")
							{
								temp['user_list'].push(global.term_list[term_key]['user_list'][user_key]);
							}*/
						}
						temp['data'] = global.pool[datasource][data_key];
						output.push(temp);
					}
				}
			}
		}
		//match term and pack
	}
	global.config.module_status[caller]['update_status'][datasource]=global.config.pool_status[datasource]['last_id'];
	return output;
}
function(data_file_root){
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
	fs.writeFile(data_file_root+'user.json',JSON.stringify(global.user_list,undefined,2),function(err){
		if(err){
			console.log('user sync error');
		}else{
			console.log('user sync success');
		}
	});
	fs.writeFile(data_file_root+'term.json',JSON.stringify(global.term_list,undefined,2),function(err){
		if(err){
			console.log('term sync error');
		}else{
			console.log('term sync success');
		}
	});
}
exports.update_user = update_user;
exports.get_user = get_user;
exports.add_term = add_term;
exports.remove_term = remove_term;
exports.get_term = get_term;
exports.poll = poll;
exports.sync = sync;
