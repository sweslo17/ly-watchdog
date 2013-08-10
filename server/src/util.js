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
	if(global.user_list[user_id] == undefined)
	{
		global.user_list[user_id] = {};
	}
	global.user_list[user_id] =  profile;
}
function poll(caller,datasource)
{
	if(global.module_status[caller]['update_status']['calander']<global.pool_status[datasource]['last_id'])
	{
		//match term and pack
	}
}
exports.update_user = update_user;
exports.add_term = add_term;
exports.remove_term = remove_term;
exports.get_term = get_term;
