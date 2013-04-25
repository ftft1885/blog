var http = require('http');

var opt = {
	hostname: 'localhost',
	path: '/',	
	port: 81,
	//agent: false	
}

for(var i = 0; i < 20; i++) {
	t();
}
function t() {
	var req = http.request(opt, function(res) {
		res.on('data', function(data) {
			console.log(data+'');
		})
	})
	req.end();
}
/*
var req = http.request(opt,function(res) {
	res.on('data', function(data) {
		console.log("============data===========");
		console.log(data+'');
		console.log(res.headers+req.connection.remotePort);
		
	})
	res.on('end', function() {
		console.log("=======end===========");
		console.log(res.headers+req.connection.remotePort);
	})
})
req.write('222\n');
req.end('sdfsd');
*/