const { mkdir, rm, readdir, readFile, writeFile } = require('fs/promises');
const { copyFile } = require('fs');
const path = require('path');
const { createWriteStream } = require('node:fs');

async function copyDir() {
  const newFolder = path.join(__dirname, 'project-dist', 'assets');
  await rm(path.join(__dirname, 'project-dist'), {
    recursive: true,
    force: true,
  })
    .then()
    .catch((err) => console.error(err));
  createNewFolder(__dirname, 'project-dist');
  createNewFolder(path.join(__dirname, 'project-dist'), 'assets');
  const folderForCopy = path.join(__dirname, 'assets');
  readdir(folderForCopy, {
    recursive: true,
    withFileTypes: true,
  })
    .then((data) => {
      data.forEach(async (dataElement) => {
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
          if (err) console.error(err);
        });
      });
    })
    .catch((e) => console.error(e));
}

function createNewFolder(folderPath, folderName) {
  const newFolderPath = path.join(folderPath, folderName);
  mkdir(newFolderPath, { recursive: true })
    .then()
    .catch((e) => console.error(e));
  return newFolderPath;
}

copyDir()
  .then(async () => {
    await buildStyles();
    await replaceTemplate();
  })
  .catch((e) => console.error(e));

function buildStyles() {
  const folderToAddBundle = path.join(__dirname, 'project-dist');
  const folderForCopy = path.join(__dirname, 'styles');
  readdir(folderForCopy, {
    recursive: true,
    withFileTypes: true,
  })
    .then((arrayDirectObjects) => {
      const writableStream = createWriteStream(
        path.join(folderToAddBundle, 'style.css'),
      );
      arrayDirectObjects
        .filter((item) => item.isFile() && path.parse(item.name).ext === '.css')
        .forEach(async (directObject, index, array) => {
          const isLastChunk = array.length - 1 === index;
          const pathFileCss = path.join(directObject.path, directObject.name);
          await readFile(pathFileCss).then((data) => {
            writableStream.write(`${data}${isLastChunk ? '' : '\n'}`);
          });
        });
    })
    .catch((e) => console.error(e));
}

async function replaceTemplate() {
  const templatePath = path.join(__dirname, 'template.html');
  const componentsPath = path.join(__dirname, 'components');
  let templateHtml = await readFile(templatePath, 'utf8');
  const direntObjects = await readdir(componentsPath, {
    recursive: true,
    withFileTypes: true,
  });
  for (const htmlDirectObject of direntObjects.filter((directObject) => {
    return directObject.name.slice(-5) === '.html';
  })) {
    const nameTemplate = htmlDirectObject.name.replace('.html', '');
    const templateString = await readFile(
      path.join(htmlDirectObject.path, htmlDirectObject.name),
      'utf8',
    );
    templateHtml = templateHtml.replaceAll(
      `{{${nameTemplate}}}`,
      templateString,
    );
  }
  await writeFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    templateHtml,
  );
}
