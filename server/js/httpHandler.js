const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

const messagesQueue = require('./messageQueue');
const messagesArr = messagesQueue.messagesArr;



// Path for the background image ///////////////////////
backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url );
  // console.log(req.headers);
  let reqData = req.url.slice(2);

  if (reqData === 'swim' || (reqData === '') ) {
    let firstQueueEle = messagesQueue.dequeue();
    res.writeHead(200, headers);
    res.end(JSON.stringify(firstQueueEle));
    next(); // invoke next() at the end of a request to help with testing!
  } else {
    // res.writeHead(404, headers);
    // res.end();
    // next();
    var type = "image/jpeg";
    var file = backgroundImageFile;
    console.log(file);
    var stream = fs.createReadStream(file);
    stream.on('open', function() {
      res.setHeader('Content-Type', type);
      stream.pipe(res);
    });
    stream.on('error',function() {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 404;
      res.end('Not found');
    });

      // var body = "";
      // req.on('data', function (chunk) {
      //   body += chunk;
      // });
      // req.on('end', function () {
      //   console.log('POSTed: ' + body);
      //   res.writeHead(200);
      //   res.end();
      // });


  }

};
