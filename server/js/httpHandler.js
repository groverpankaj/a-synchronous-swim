const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

const messagesQueue = require('./messageQueue');
const messagesArr = messagesQueue.messagesArr;



// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////
console.log(module.exports.backgroundImageFile);
let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url );
  // console.log(req.headers);
  let reqData = req.url.slice(2);

  // console.log(path.basename(req.url ));

  if(req.method === 'GET') {

    if (reqData === 'swim') {
      let firstQueueEle = messagesQueue.dequeue();
      res.writeHead(200, headers);
      res.end(JSON.stringify(firstQueueEle));
      next(); // invoke next() at the end of a request to help with testing!
    } else {
      var type = "image/jpeg";
      var backgroundImageFile = path.join('.', req.url);
      var file = backgroundImageFile;
      console.log(file);
      var stream = fs.createReadStream(file);
      stream.on('open', function() {
        res.writeHead(200, headers);
        // res.statusCode = 200;
        // res.setHeader('Content-Type', type);
        stream.pipe(res);
        next();
      });
      stream.on('error',function() {
        // res.setHeader('Content-Type', 'text/plain');
        // res.statusCode = 404;
        res.writeHead(404, headers);
        res.end('Not found');
        next();
      });

    }
  }

  if (req.method === 'POST') {
    var body = "";
    let stream = fs.createWriteStream('background.jpg')
    // stream.setDefaultEncoding()
    req.on('data', function (chunk) {
      stream.write(chunk);
      // body += chunk;
    });
    req.on('end', function() {
      stream.end();
      console.log('ENDED');
      // res.end();
    });
    // stream.on('error',function() {
    //       // res.setHeader('Content-Type', 'text/plain');
    //       // res.statusCode = 404;
    //       res.writeHead(404, headers);
    //       res.end('Tea cup');
    //       next();
    //     });
    // req.pipe(stream);
    // req.on('end', function () {
    //   // console.log('POSTed: ' + body);


    //   stream.on('open', function() {
    //     console.log(body);
    //     res.writeHead(200, headers);
    //     req.pipe(stream);
    //     res.end();
    //     next();
    //   });
    //   stream.on('error',function() {
    //     // res.setHeader('Content-Type', 'text/plain');
    //     // res.statusCode = 404;
    //     res.writeHead(404, headers);
    //     res.end('Not found');
    //     next();
    //   });

    //   res.writeHead(200);
    //   res.end();
    // });
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end(JSON.stringify('swim'));
    next(); // invoke next() at the end of a request to help with testing!
  }






};
