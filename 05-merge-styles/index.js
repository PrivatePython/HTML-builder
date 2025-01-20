const { readdir } = require('fs/promises');
const path = require('path');
const { readFile, createWriteStream } = require('node:fs');

const folderToAddBundle = path.join(__dirname, 'project-dist');
const folderForCopy = path.join(__dirname, 'styles');
readdir(folderForCopy, {
  recursive: true,
  withFileTypes: true,
})
  .then((arrayDirectObjects) => {
    const writableStream = createWriteStream(
      path.join(folderToAddBundle, 'bundle.css'),
    );
    arrayDirectObjects
      .filter((item) => item.isFile() && path.parse(item.name).ext === '.css')
      .forEach((directObject, index, array) => {
        const isLastChunk = array.length - 1 === index;
        const pathFileCss = path.join(directObject.path, directObject.name);
        readFile(pathFileCss, (err, data) => {
          if (err) {
            console.log(err);
            return;
          }
          writableStream.write(`${data}${isLastChunk ? '' : '\n'}`);
          if (isLastChunk) {
            writableStream.close();
          }
        });
      });
  })
  .catch((e) => console.error(e));
