function stristr (haystack, needle, bool) {
	// http://kevin.vanzonneveld.net
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   bugfxied by: Onno Marsman
	// *     example 1: stristr('Kevin van Zonneveld', 'Van');
	// *     returns 1: 'van Zonneveld'
	// *     example 2: stristr('Kevin van Zonneveld', 'VAN', true);
	// *     returns 2: 'Kevin '
	var pos = 0;

	haystack += '';
	pos = haystack.toLowerCase().indexOf((needle + '').toLowerCase());
	if (pos == -1) {
		return false;
	} else {
		if (bool) {
			return haystack.substr(0, pos);
		} else {
			return haystack.slice(pos);
		}
	}
}
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
function cmp(a,b)
{
	return b.count-a.count;
}
function query(input_query)
{
	//console.log("call query");
	//console.log(global.newsData);
	var law_map = [];
	for(var i=0;i<11000;i++)
	{
		law_map[i] = 0;
	}
	var key = -1;
	var query_str = input_query['term'];
	console.log("Query: "+query_str);
	if(query_str == ''||input_query==undefined)
		return [];
	flag = 0;
	for(var i=0;i<global.newsData.length;i++)
	{
		flag = 0;
		for(var j=0;j<global.newsData[i]['body'].length;j++)
		{
			//console.log(global.newsData[i]['body'][j]);
			//console.log(global.newsData[i]['body'][j].indexOf(query_str));
			if(global.newsData[i]['body'][j].indexOf(query_str)!=-1)
			{
				//console.log(global.newsData[i]['body'][j]);
				flag = 1;
				break;
			}
		}
		if(flag == 1)
		{
			var re = new RegExp(".*\u898f\u7a0b$"+
					"|.*\u898f\u5247$"+
					"|.*\u7d30\u5247$"+
					"|.*\u8fa6\u6cd5$"+
					"|.*\u7db1\u8981$"+
					"|.*\u6a19\u6e96$"+
					"|.*\u6e96\u5247$"+
					"|.*\u689d\u4f8b$"+
					"|.*\u901a\u5247$"+
					"|.*\u6cd5$"+
					"|.*\u5f8b$");
			for(var j=0;j<global.newsData[i]['body'].length;j++)
			{
				if(global.newsData[i]['body'][j].match(re))
				{
					//console.log(global.newsData[i]['body'][j]);
					if((key = global.lawdic.get(global.newsData[i]['body'][j]))!=undefined)
					{
						//console.log(key+':'+global.newsData[i]['body'][j]);
						key = parseInt(key);
						law_map[key] += 1;
					}
				}
			}
		}
	}
	//console.log(law_map[9696]);
	var output_count = 0;
	var output = [];
	for(var i=0;i<law_map.length;i++)
	{
		if(law_map[i]>0)
		{
			//console.log(global.lawdic_map[i]+':'+law_map[i]);
			output[output_count] = {};
			output[output_count]['law'] = global.lawdic_map[i];
			output[output_count]['count'] = law_map[i];
			output_count++;
		}
	}
	output.sort(cmp);
	return output;
}
exports.query = query;
