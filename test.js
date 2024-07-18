var https = require('follow-redirects').https;
var fs = require('fs');

var options = {
  method: 'POST',
  hostname: 'k3yq9e.api.infobip.com',
  path: '/email/3/send',
  headers: {
    Authorization: 'App {{api_key}}',
    'Content-Type': 'multipart/form-data',
    Accept: 'application/json',
  },
  maxRedirects: 20,
};

var req = https.request(options, function (res) {
  var chunks = [];

  res.on('data', function (chunk) {
    chunks.push(chunk);
  });

  res.on('end', function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on('error', function (error) {
    console.error(error);
  });
});

var postData =
  '------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="from"\r\n\r\nAuto mail <giangvo0206@gmail.com>\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="subject"\r\n\r\nFree trial\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="to"\r\n\r\n{"to":"giangvo0206@gmail.com","placeholders":{"firstName":"Giang Võ"}}\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="text"\r\n\r\nHi {{firstName}}, this is a test message from Infobip. Have a nice day!\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--';

req.setHeader(
  'content-type',
  'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
);

req.write(postData);

req.end();
