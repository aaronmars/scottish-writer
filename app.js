(function() {
    'use strict';
    var http = require('http');
    var fs = require('fs');
    var url = require('url');
    http.createServer(function(req, res) {
        var fileName = url.parse(req.url).pathname;
        fs.readFile('./' + fileName, 'binary', function(err, content) {
            if(err) {
                res.writeHead(404);
            } else if(content !== null && content !== '') {
                res.writeHead(200, { 'Content-Length': content.length });
                res.write(content);
            }
            res.end();
        });

    }).listen(8800);
})();
