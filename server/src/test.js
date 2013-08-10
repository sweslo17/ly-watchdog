var fs = require('fs');
var test = [];
test["abc"] = {};
test["bbb"] = {};
test["abc"]["ttt"] = 1;
test['bbb']['rrr'] = 2;
console.log(JSON.stringify(test));
fs.writeFile('test.json',JSON.stringify(test,undefined,2),function(err){
		if(err){
			console.log('conf sync error');
		}else{
			console.log('conf sync success');
		}
	});
