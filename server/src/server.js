var http = require("http");
var url = require("url");
var port = 8888;
function start(route,handle){
	function onRequest(request, response) {
		var pathname = url.parse(request.url,true).pathname;
		var query = url.parse(request.url,true).query;
		console.log("request for: "+pathname+" received");
		var text = route(pathname,query,handle);
		response.writeHead(200, {"Content-Type": "text/plain","Access-Control-Allow-Origin": "*"});
		//console.log(text);
		//if(text != '404 not found')
		response.write(JSON.stringify(text));
		response.end();
	}
	http.createServer(onRequest).listen(port);
	console.log('server has started on '+port);
}
exports.start = start;
