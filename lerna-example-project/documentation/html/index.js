/* ==========================================================================
    Produce widgets static documentation pages
    For multi-version documents must include last version & widget description in package.json file
========================================================================== */

/* ==========================================================================
    #Libraries
========================================================================== */
const Fs = require('fs-extra');
const PathUtil = require('path');
const Handlebars = require('handlebars');
const Argv = require('yargs').argv;
const Mkdirp = require('mkdirp');
const _ = require('lodash');
const gitSemverTags = require('git-semver-tags');
const execSync = require('child_process').execSync;

/* ==========================================================================
#User Input Arguments
========================================================================== */
const userParam = Argv.outputPath;

const logMessage = (message) =>
  Argv.logs && console.log(message)

const environments = {
  pre: "pre-content-services.dtn.com",
  prod: "content-services.dtn.com"
};
const environment = Argv.env && environments[Argv.env] || environments['pre'];

/* ==========================================================================
#File Variables
========================================================================== */
const searchDocumentFileName = '-doc.json';
const sidebarTemplateFile = __dirname + '/partials/sidebar-menu-links.hbs';
const siteRoot = `${__dirname}/../..`;
const searchDirectory = `${siteRoot}/packages/`;
const widgetLandingTemplateFile = __dirname + '/partials/widgets-landing-page.hbs';
const widgetTemplateFile = __dirname + '/partials/widget-template.hbs'
const sharedOptionsDataFile = __dirname + '/shared-options/options.json';
const sharedOptionTemplate =  __dirname + '/partials/shared-option-template.hbs';

const distFolderPath = userParam ? `${siteRoot}/${userParam}/` : `${siteRoot}/docs-site/`;
const buildWidgetsPath = `${siteRoot}/widgets-build/`;

const defaultDocFileName = 'index.html';

/*
* Follow the widget names as they are in package.json widget_title.
* ONLY this widgets will be built AND in THIS ORDER.
* Add future widgets here to produce docs
*/

const widgetOrder = [
  "Local Weather Widget",
  "Interactive Map Widget",
  "Weather Graphics Widget",
  "Futures Chart Widget",
  "Cash Bids Chart Widget",
  // "Premium Hourly Forecast Widget",
  // "Premium Extended Forecast Widget",
  // "Advanced Futures Chart Widget"
]
/* ==========================================================================
    #Static Folder Variable
========================================================================== */
const staticFilesToTransfer = [
  '/assets/',
  '/favicon.ico'
];

/* ==========================================================================
    #Global Objects
========================================================================== */
let sidebarData = {};
let sidebarTemplate = "";
let widgetTemplate = "";
let widgetLandingTemplate = "";
let widgetLandingData = {};
let partialHTML = "";
let partialTemplate = "";
let docFiles = [];
let allWidgetTags = [];

/* ==========================================================================
    #Handlebars Helpers
========================================================================== */

Handlebars.registerHelper('if_even', function (conditional, options) {
  if ((conditional % 2) == 0) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('json', function (context) {
  return JSON.stringify(context, null, 2);
});

/* ==========================================================================
    #Main Functions
========================================================================== */
const writeWidgetLandingPage = (data) =>
  Fs
    .createWriteStream(distFolderPath + defaultDocFileName)
    .write(widgetLandingTemplate({ "widget": sortWidgets(data) }))

const writeWidgetDocFile = (dest, widgetData, widgetPkgName, latestVersion) => {
  let fileName = `${widgetPkgName}-${latestVersion}`;
  let patchFileName = `${widgetPkgName}-${setLatestPatchVersion(latestVersion)}`;

  let data = JSON.parse(JSON.stringify(widgetData));
  let patchedData = JSON.parse(JSON.stringify(widgetData));


  let [ versionLinks, patchVersionLinks  ]  = getOldWidgetLinks(allWidgetTags, widgetPkgName);

  if (versionLinks && versionLinks.length) {
    data["version-select"] = versionLinks;
    patchedData["version-select"] = patchVersionLinks;
  }


  data.sections.unshift(setInstallationSection(widgetPkgName, fileName));
  patchedData.sections.unshift(setInstallationSection(widgetPkgName, patchFileName));
  Fs
    .createWriteStream(`${dest}/${fileName}.html`)
    .write(widgetTemplate({ "widgetScriptFileName": fileName, ...data}));

  Fs
    .createWriteStream(`${dest}/${patchFileName}.html`)
    .write(widgetTemplate({ "widgetScriptFileName": patchFileName, ...patchedData}));
}

const registerSidebarTemplates = (data) => {
  let widgetsData = sortWidgets(data);
  let sidebarData = { "landing": false, "links": widgetsData };
  let sidebarDataLanding = { "landing": true, "links": widgetsData };

  Handlebars.registerPartial('sidebar', sidebarTemplate(sidebarData));
  Handlebars.registerPartial('sidebarLanding', sidebarTemplate(sidebarDataLanding));
}

const sortWidgets = (data) =>
  widgetOrder
    .map( widgetName => {
      if (data[widgetName]) {
        let widgetData = JSON.parse(JSON.stringify(data[widgetName]));
        delete data[widgetName];
        return widgetData;
      } else {
        return undefined;
      }
    })
    .filter( widgetData => widgetData !== undefined)
    .concat(Object.values(data))

const registerSharedOptionTemplates = () => {
  const sharedOptionsData = Fs.pathExistsSync(sharedOptionsDataFile) ? Fs.readJsonSync(sharedOptionsDataFile) : {};
  Object.keys(sharedOptionsData).forEach(partialName => {
    let partialValue = sharedOptionsData[partialName];
    Handlebars.registerPartial(partialName, partialTemplate(partialValue));
  });
}

/* ==========================================================================
    #Data Manipulation
========================================================================== */
const clone = obj =>
  (Object.getPrototypeOf(obj) !== Object.prototype) ? obj : Object.keys(obj).reduce((acc, key) => (acc[key] = clone(obj[key]), acc), {})

const getDocFiles = (baseFolder) =>
  loopFolder(baseFolder)
    .map(widgetFolder => Fs.readdirSync(widgetFolder)
      .filter(isDocumented)
      .map(file => PathUtil.join(widgetFolder, file))
    )
    .filter(folder => folder.length)
    .map(folder => folder.length > 1 ? folder : folder[0])


const loopFolder = (folder) =>
  Fs.readdirSync(folder).map(path => PathUtil.join(folder, path))

const getTemplateFiles = () => {
  // get Sidebar Template
  sidebarHTML = Fs.readFileSync(sidebarTemplateFile);
  sidebarTemplate = Handlebars.compile(sidebarHTML.toString('utf-8'));

  // get  widget page template
  widgetHTML = Fs.readFileSync(widgetTemplateFile);
  widgetTemplate = Handlebars.compile(widgetHTML.toString('utf-8'));

  // get widget landing page template
  widgetLandingHTML = Fs.readFileSync(widgetLandingTemplateFile);
  widgetLandingTemplate = Handlebars.compile(widgetLandingHTML.toString('utf-8'));

  // get shared options partial template
  partialHTML = Fs.readFileSync(sharedOptionTemplate);
  partialTemplate = Handlebars.compile(partialHTML.toString('utf-8'));
}

const createWidgetFolder = (fileName) => {
  let widgetFolder = distFolderPath + setNameDashes(fileName);
  Mkdirp.sync(widgetFolder);

  return widgetFolder;
}

const extractWidgetFiles = (widgetDashedName, widgetVersion) => {
  const destinationPath = `${buildWidgetsPath}${widgetDashedName}`;
  Mkdirp.sync(destinationPath);

  if (Fs.existsSync(`${searchDirectory}${widgetDashedName}/dist/${widgetDashedName}.js`)) {

    let widgetFile = Fs.readFileSync(`${searchDirectory}${widgetDashedName}/dist/${widgetDashedName}.js`);
    let patchVersionLatest = setLatestPatchVersion(widgetVersion);
    Fs
      .createWriteStream(`${destinationPath}/${widgetDashedName}-${widgetVersion}.js`)
      .write(widgetFile);
    Fs
      .createWriteStream(`${destinationPath}/${widgetDashedName}-${patchVersionLatest}.js`)
      .write(widgetFile)
  } else {
    logMessage(`Couldn't find ${widgetDashedName}.js at ${searchDirectory}${widgetDashedName}/dist/`);
  }
}

/* ==========================================================================
    #Util Functions
========================================================================== */
const extractTagVersion = (tag) =>
  tag.substring(tag.lastIndexOf("@") + 1)

const getOldWidgetTags = (tags, latestName) => tags.filter(tag => tag.indexOf(latestName) === 5) // 5 because of tags pattern "@DTN/" + "WIDGET NAME"

const getOldWidgetLinks = (tags, widgetNameDashed) =>{
  let oldTags = getOldWidgetTags(tags, widgetNameDashed);
  if (oldTags.length <= 1) {
    return [ [], []];
  }
  let latestTag = oldTags.shift();
  let latestVersion = setLatestPatchVersion(extractTagVersion(latestTag));
  let versionLinks = oldTags.map(tag => ({ url: `${widgetNameDashed}-${extractTagVersion(tag)}.html`, title: `v.${extractTagVersion(tag)}` }));
  versionLinks.unshift({ url: `${widgetNameDashed}-${extractTagVersion(latestTag)}.html`, title: `v. ${extractTagVersion(latestTag)}`, "selected": "selected"});
  versionLinks.unshift({ url: `${widgetNameDashed}-${latestVersion}.html`, title: `v. ${latestVersion}`});

  let patchVersionLinks = oldTags.map(tag => ({ url: `${widgetNameDashed}-${extractTagVersion(tag)}.html`, title: `v. ${extractTagVersion(tag)}` }));
  patchVersionLinks.unshift({ url: `${widgetNameDashed}-${latestVersion}.html`, title: `v. ${latestVersion}`, "selected": "selected" });

  return [versionLinks, patchVersionLinks];
}

const getGitTags = () =>
  new Promise((resolve, reject) => {
    gitSemverTags(async (err, tags) => {
      allWidgetTags = tags.filter(tag => tag.indexOf('-widget') >= 0); // get only tags for widgets
      resolve( allWidgetTags );
    }, { lernaTags: true })
  })


const checkConfigFile = () => {
  if (Fs.existsSync(`${siteRoot}/config.json`) ) {
    Fs.copySync(`${siteRoot}/config.json`, `${distFolderPath}config.json`)
  } else {
    logMessage("Please add a config.json file at root");
  }
}

const isDocumented = (file) =>
  file.endsWith('doc.json')

const setLatestPatchVersion = (widgetVersion) => {
  let [ vMajor, vMinor, vPatch ] = widgetVersion.split(/\./g);
  vMinor = 0; // Hardcode minor to '0' for backward compatibility.

  return [ vMajor, vMinor ].join('.') + '-latest';
}

const setNameDashes = (fileNameRaw) =>
  PathUtil.basename(fileNameRaw, searchDocumentFileName)

const setNameDisplay = (fileNameRaw) =>
  PathUtil.basename(fileNameRaw, searchDocumentFileName).replace(/-/g, ' ').split(' ').map((word) => _.capitalize(word)).join(' ');

const copyStaticFiles = (src, dest) =>
  src.forEach(file => {
    Fs.copy(__dirname + file, dest + file)
  })
// sort Doc versions by desc order using padding & unary plus

const sortDocsByVersion = (arr) => (f => f(f(arr, 1).sort(), -1))((arr, v) => arr.map(a => a.replace(/\d+/g, n => +n + v * 100)));

const getPackageDetails = (file) => {
  let packageJSONfileContent = Fs.pathExistsSync(PathUtil.dirname(file) + '/package.json') ? Fs.readJsonSync(PathUtil.dirname(file) + '/package.json') : {};
  let latestVersion = packageJSONfileContent.version;
  let widgetDashedName = packageJSONfileContent.name.replace('@dtn/', '');
  let widgetDisplayName = setNameDisplay(widgetDashedName);
  let description = packageJSONfileContent.description;

  return [latestVersion, widgetDashedName, widgetDisplayName, description];
}

const setInstallationSection = (fileNameDashed, widgetFileName) =>
  ({
    "section_title": "Installation",
    "source": [
      // {
      //   "target": "npm",
      //   "link": `https://www.npmjs.com/package/@dtn/${fileNameDashed}`
      // },
      {
        "target": "script",
        "link": " ",
        "class": "jsLink",
        "download": "download"
      }
    ]
  })

/* ==========================================================================
    #Main Execution Flow
========================================================================== */
logMessage("Deleting Destination Folder and Files");
Fs.removeSync(distFolderPath);

getTemplateFiles();
logMessage("Getting templates for sidebar, widget page, widget landing page, shared option partial");

docFiles = getDocFiles(searchDirectory);
logMessage("Getting Document Files");

registerSharedOptionTemplates();
logMessage("Register shared option partials");

let prepareWidgetDoc = docFiles
  .map(async file => {


    let widgetsData = [];

    //get info from package.json file
    file = Array.isArray(file) ? file : [file];
    let [latestVersion, widgetDashedName, widgetDisplayName, description] =  getPackageDetails(file[0]);
    let patchFileName = `${widgetDashedName}-${setLatestPatchVersion(latestVersion)}`;
    let patchFileNameHtml = `${patchFileName}.html`;
    let widgetLink = `${widgetDashedName}/${patchFileNameHtml}`;
    sidebarData[widgetDisplayName] = { "url": widgetLink, "title": widgetDisplayName, "class": widgetDashedName };
    widgetLandingData[widgetDisplayName] = { "url": widgetLink, "title": widgetDisplayName, "widgetDescription": description, "widgetVersion": latestVersion };
    extractWidgetFiles(widgetDashedName, latestVersion);

    file.forEach(version => {
      let fileContent = Fs.readJsonSync(version);
      fileContent = Object.assign(fileContent, { "widget_title": widgetDisplayName, "description": description, "widget_name_dash": widgetDashedName, "widgetHost": environment, "select-version": '', });
      widgetsData.push(fileContent);
    });

    return { widgetsData, latestVersion, widgetDashedName };
  });

  Promise
    .all([getGitTags(), ...prepareWidgetDoc])
    .then( arrayOfWidgets => {
      arrayOfWidgets.shift();
      registerSidebarTemplates(sidebarData);
      logMessage("Registering Sidebar Template");
      arrayOfWidgets.map(({widgetsData, latestVersion, widgetDashedName}) => {

        let dest = createWidgetFolder(widgetDashedName);
        let fileContent = widgetsData[0];
        writeWidgetDocFile(dest, fileContent, widgetDashedName, latestVersion);
      })
    })
    .then(() => {
      logMessage("Writing Widget for the Landing Page");
      writeWidgetLandingPage(widgetLandingData);
      checkConfigFile();
      logMessage('Check for configuration file');
      logMessage('Writing Widget Done');

      copyStaticFiles(staticFilesToTransfer, distFolderPath);
      logMessage('Writing Static Files');
      logMessage('All Done!');
    })
    .catch(err => console.log(err));
