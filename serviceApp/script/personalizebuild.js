const fs = require('fs-extra');
const xml = require('xml-parse');
var __appNmeOld=""
var oldPackgName=""
const __customDir = process.argv[2]
const __o={}
//command is npm run make-personalize-build <doc1>
if(__customDir && __customDir !=""){
    const info = fs.readFileSync("./"+__customDir+"/info.txt").toString();
    var __a = info.split(/\r?\n/)
    for(var i=0; i < __a.length; i++){
      var __aa=  __a[i].split("=")
      __o[__aa[0]]=__aa[1]
    }
}else{

    console.log("No data folder available")
    return
}
var npkgPath = './android/app/src/main/java/'+__o.applicationId.split(".").join("/")
preparePersonalizeApp()
function preparePersonalizeApp(){
    makeBackup(()=>{
        checkDir(npkgPath,()=>{
        prepareAppName()
        prepareManifest()
        prepareGradle()
        updateJavaClass()
        replaceAssets()
        console.log("packege prepare successfully, Please run react-native run-android")
    })
    })
    
}

//checkDir(npkgPath)
//updateJavaClass()
function  makeBackup(callback){
    const buildDir="./android/app/build"
    if (fs.existsSync(buildDir)){
        fs.remove(buildDir, (err)=>{
            if (err) throw err;
        });
    }
    var backupPath ="backup/"+new Date().getTime().toString()
    checkDir(backupPath)
    fs.copy("android", backupPath+"/android", function (err) {
        if (err) throw err;
         // console.log("makeBackup  success!");
          if(callback)callback()
       
      });
//console.log("backupPath",backupPath)

}
function prepareGradle(){
    const gradlePath = './android/app/build.gradle';
const gradle = fs.readFileSync(gradlePath).toString();
const __arr = gradle.split("applicationId")
const part2Arr = __arr[1].split("}")
const gradarr = part2Arr[0].split(/\r?\n/)
const pidconf = 'buildConfigField "String",  "PROVIDER_ID",     \'"'+__o.providerId+'"\''
const pconf = 'buildConfigField "Boolean", "PERSONALIZE", "'+__o.personalize+'"'
const nameConf ='buildConfigField "String",  "COMPANY_NAME",     \'"'+__o.companyName+'"\''
var _arr=["applicationId "+'"'+__o.applicationId+'"',]
_arr.push(pidconf)
_arr.push(pconf)
_arr.push(nameConf)
for(var i=1; i < gradarr.length; i++){
if(gradarr[i].indexOf("buildConfigField") < 0){
    _arr.push(gradarr[i])
}
}
part2Arr.splice(0,1)
const __arrStr = _arr.join("\r\n")
var __ngradle = __arr[0]+__arrStr+"\r\n}\r\n"+part2Arr.join("}")
 writeTxtFile(gradlePath,__ngradle)
}
function prepareAppName(){
    const stringsPath='./android/app/src/main/res/values/strings.xml'
    const strings = fs.readFileSync(stringsPath).toString();
    var parseStringsdXML = xml.parse(strings)    
    for(var i=0; i < parseStringsdXML[0].childNodes.length; i++){
        if(parseStringsdXML[0].childNodes[i].type == "element"){
            if(parseStringsdXML[0].childNodes[i].attributes && parseStringsdXML[0].childNodes[i].attributes.name && parseStringsdXML[0].childNodes[i].attributes.name =="app_name"){
                __appNmeOld =parseStringsdXML[0].childNodes[i].innerXML
                break;
            }
            
        }
    }
    var __newStrings = strings.split(__appNmeOld).join(__o.appName)
    writeTxtFile(stringsPath,__newStrings)
}
function prepareManifest(){
    var manifestPath = './android/app/src/main/AndroidManifest.xml'
    const manifestXML = fs.readFileSync(manifestPath).toString();
    var parsedXML = xml.parse(manifestXML)
    oldPackgName=parsedXML[0].attributes.package
    var newManifest = manifestXML.split(oldPackgName).join(__o.applicationId)
    writeTxtFile(manifestPath,newManifest)
}


function updateJavaClass(){
    const dirPath ='./android/app/src/main/java/'+oldPackgName.split(".").join("/")
    
    fs.readdir(dirPath, function (err, files) {
        if (err) {
            if (err) throw err;
        } 
        files.forEach(function (file) {
            const classTxt = fs.readFileSync(dirPath+"/"+file).toString();
            const newClassTxt = classTxt.split(oldPackgName).join(__o.applicationId)
            //console.log(newClassTxt); 
            writeTxtFile(npkgPath+"/"+file,newClassTxt)
        });
        fs.remove(dirPath, (err)=>{
            if (err) throw err;
            //console.log("updateJavaClass delete error ",err)
        });
    });
}
function checkDir(path,callback){
    if (!fs.existsSync(path)){
        fs.mkdir(path, { recursive: true }, (err) => {
            if (err) throw err;
            if(callback)callback()
        });
    }
    
}
function writeTxtFile(path,content){
    fs.writeFile(path, content, function (err) {
        if (err) throw err;
        console.log('file written '+path);
      });
}
function replaceAssets()
{
var asstsDest=['./android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png',
'./android/app/src/main/res/mipmap-hdpi/ic_launcher.png',
'./android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png',
'./android/app/src/main/res/mipmap-mdpi/ic_launcher.png',
'./android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png',
'./android/app/src/main/res/mipmap-xhdpi/ic_launcher.png',
'./android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png',
'./android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png',
'./android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png',
'./android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png',
'./assets/images/logo.png'
]
const srcIcons =[
    "./"+__customDir+"/hdpi-72x72-round.png",
    "./"+__customDir+"/hdpi-72x72.png",
    "./"+__customDir+"/mdpi-48x48-round.png",
    "./"+__customDir+"/mdpi-48x48.png",
    "./"+__customDir+"/xhdpi-96x96-round.png",
    "./"+__customDir+"/xhdpi-96x96.png",
    "./"+__customDir+"/xxhdpi-144x144-round.png",
    "./"+__customDir+"/xxhdpi-144x144.png",
    "./"+__customDir+"/xxxhdpi-192x192-round.png",
    "./"+__customDir+"/xxxhdpi-192x192.png",
    "./"+__customDir+"/logo.png"
]
for(var i=0; i< srcIcons.length; i++){
    fs.copyFile(srcIcons[i], asstsDest[i], fs.constants.COPYFILE_FICLONE, (err) => {
        if (err) throw err;
        //console.log('copy error ',err);
      });
}
}