const { mkdir, rm, readdir } = require('fs/promises');
const { copyFile } = require('fs');
const path = require('path');

async function copyDir() {
  const newFolder = path.join(__dirname, 'files-copy');
  await rm(newFolder, { recursive: true, force: true })
    .then()
    .catch((err) => console.error(err));
  createNewFolder(__dirname, 'files-copy');
  const folderForCopy = path.join(__dirname, 'files');
  readdir(folderForCopy, {
    recursive: true,
    withFileTypes: true,
  })
    .then((data) => {
      data.forEach((dataElement) => {
        if (!dataElement.isFile()) {
          createNewFolder(
            dataElement.parentPath.replace(folderForCopy, newFolder),
            dataElement.name,
          );
          return;
        }
        const pathFileForCopy = path.join(
          dataElement.parentPath,
          dataElement.name,
        );
        const pathDestination = path.join(
          dataElement.parentPath.replace(folderForCopy, newFolder),
          dataElement.name,
        );
        copyFile(pathFileForCopy, pathDestination, (err) => {
          if (err) console.log(err);
        });
      });
    })
    .catch((e) => console.error(e));
}

copyDir();

function createNewFolder(folderPath, folderName) {
  const newFolderPath = path.join(folderPath, folderName);
  mkdir(newFolderPath, { recursive: true })
    .then()
    .catch((e) => console.error(e));
  return newFolderPath;
}
