var net = require('net');

net.createServer(function(c) {
	c.on('data', function(data) {
	
		var client = net.createConnection({port: 80}, function() {
			client.write(data);
		});
		var dd = "";
		client.on('data', function(_d) {
			//console.log(_d+'');
			dd += _d;
		})
		client.on('end', function() {
			c.write(dd);
		})
		
	})
}).listen(81);

function send() {
	var client = net.createConnection({port: 80}, function() {
		client.write(data);
	});
	var dd = "";
	client.on('data', function(_d) {
		console.log(_d+'');
		dd += _d;
	})
	client.on('end', function() {
		res.end(dd);
	})
}