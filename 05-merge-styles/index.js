const { readdir, readFile } = require('fs/promises');
const path = require('path');
const { createWriteStream } = require('node:fs');

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
      .forEach(async (directObject, index, array) => {
        const isLastChunk = array.length - 1 === index;
        const pathFileCss = path.join(directObject.path, directObject.name);
        await readFile(pathFileCss)
          .then((data) => {
            writableStream.write(`${data}${isLastChunk ? '' : '\n'}`);
          })
          .catch((e) => console.error(e));
        if (isLastChunk) {
          writableStream.close();
        }
      });
  })
  .catch((e) => console.error(e));
