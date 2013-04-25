var http = require('http');

http.createServer(function(req,res) {

	res.end(req.connection.remotePort+'');

	/*
	console.log(req.headers);
	console.log('000'+req.connection.remotePort);
	
	if(req.url == '/') {
	
		res.write('not finished');
		sleep(2000, function() {
			res.write('we need keep-alive');		
			res.end(req.connection.remotePort+' : finished..');
		});
		
		
	} else {		
		res.end(req.connection.remotePort+' : just finish');
		
	}
	
	req.on('data', function(data) {
		console.log(data);
		console.log('data'+req.connection.remotePort);
		
	});
	
	req.on('end', function() {
		console.log('end'+req.connection.remotePort);
		
	
			res.write('not finished');
			sleep(2000, function() {
				res.write('we need keep-alive');		
				res.end(req.connection.remotePort+' : finished..');
			});
			
			
		
	})
	*/
	
}).listen(80);


function sleep(milliSeconds, cb) { 
    var startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + milliSeconds);
	cb && cb();
 };