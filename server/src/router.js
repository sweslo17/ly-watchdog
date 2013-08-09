function route(pathname,query,handle)
{
	//console.log('in route: '+pathname);
	if(typeof handle[pathname] === 'function'){
		return handle[pathname](query);
	}else{
		console.log('fail to call function '+pathname);
		return '404 not found';
	}
}
exports.route = route;
