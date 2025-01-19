const fs = require('fs');
const readableStream = fs.createReadStream('./01-read-file/text.txt');

readableStream.on('data', (data) => console.log(data.toString()));
