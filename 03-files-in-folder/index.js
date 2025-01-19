const { readdir, stat } = require('fs/promises');
const path = require('path');

readdir(path.join(__dirname, 'secret-folder'), {
  withFileTypes: true,
}).then((value) => {
  const files = value.filter((elem) => {
    return elem.isFile();
  });
  files.forEach((file) => {
    stat(path.join(file.path, file.name)).then((value) => {
      const objPath = path.parse(file.name);
      console.log(
        `${objPath.name} - ${objPath.ext.slice(1)} - ${
          value.size ? `${(value.size / 1024).toFixed(3)}kb` : '0kb'
        }`,
      );
    });
  });
});
