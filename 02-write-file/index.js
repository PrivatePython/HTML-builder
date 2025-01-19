// 1. Import all required modules.
const fs = require('fs');
const readLine = require('readline');

const writableStream = fs.createWriteStream(__dirname + '/text.txt');

process.stdout.write('Enter your text for writing in file:\n');

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (line) => {
  if (line === 'exit') {
    rl.close();
    return;
  }
  writableStream.write(line, 'utf8');
});

rl.on('close', () => {
  process.stdout.write('\nClose writing string in file');
});
