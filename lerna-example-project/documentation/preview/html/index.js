const Fs = require("fs-extra");
const Path = require("path");
const Util = require("util");
const Handlebars = require("handlebars");

const readFile = Util.promisify(Fs.readFile);
const readDirPromise = Util.promisify(Fs.readdir);
const statPromise = Util.promisify(Fs.stat);

const searchDocumentFileName = ["-doc.json", "-preview.json"];

const widgetPreviewTemplate = __dirname + '/partials/widget-preview.hbs';
const searchDirectory = __dirname + "/../../../packages/";
const newPackageIndexHTMLFileName = "index.html";

async function readFileAsync(filePath) {
  return await readFile(filePath);
}

async function readDirAsync(dir, maxDepth = -1, allFiles = []) {
  const files = (await readDirPromise(dir)).map(file => Path.join(dir, file));
  allFiles.push(...files);

  await Promise.all(
    files.map(async file => {
      if (maxDepth > -1) {
        return (await statPromise(file)).isDirectory() && readDirAsync(file, maxDepth - 1, allFiles);
      }
      return Promise.resolve([]);
    }),
  );

  return allFiles;
}

const generateDistFolderFiles = (startPath, filter) => {
  if (!Fs.existsSync(startPath)) {
    console.log('Directory Path "' + startPath + '" Does Not Exist. Please try again!');
    return;
  }

  readDirAsync(startPath, 1).then(files => {
    for (let i = 0; i < files.length; i++) {
      let fileName = files[i];
      if (fileName.includes(filter[0]) || fileName.includes(filter[1])) {
        const normalizedPath = fileName.replace(/\\/g, "/");
        const splitPath = normalizedPath.split("packages/");
        const basePath = splitPath[0] + "packages/";
        const widgetPath = basePath + splitPath[1].split("/")[0] + "/dist/";

        const packageIndexWriteStream = Fs.createWriteStream(widgetPath + newPackageIndexHTMLFileName);
        readFileAsync(fileName)
          .then(data => {
            const widgetInfo = JSON.parse(data.toString());

            readFileAsync(widgetPreviewTemplate)
              .then( ( widgetHTML ) => {
                const handlebarCompiledString = Handlebars.compile(widgetHTML.toString('utf-8'));
                const htmlData = handlebarCompiledString(widgetInfo);
                packageIndexWriteStream.write(htmlData);
              })
              .catch( ( err ) => {
                console.log( err );
              });
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  });
};

generateDistFolderFiles(searchDirectory, searchDocumentFileName);
