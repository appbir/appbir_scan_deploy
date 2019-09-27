var cheerio = require('cheerio');
var https = require('https');
var http = require('http');
var fs = require('fs');
var config  = require('./project.config.js');
var proto = {
    https,
    http
};

 /**
  * type:'http' // 或者https  ， 未指定的时候，默认采用自动匹配
  * url:'http://news.baidu.com/', // 请求的URL地址
  * proxy:'../src/module/scan_server/baidu.html' // 自定使用代理地址  不存在配置的时候 默认使用 // 替换为指定格式
  * 
  * @param {*} option 
  */
const load = (option, callback)=>{
    let url = option.url;
    if(!url) return ;
    let type = option.type || url.split(':')[0];
    let fn = proto[type];
    if(!fn) return config.loggerError && console.log('url config error no protocol:',url);;
    let proxy = option.proxy || config.getProxy(url);
    fn.get(url, function(res) {
        var html = ''; 
        res.setEncoding('utf-8');
        res.on('data', function(chunk) {
            html += chunk;
        });
        res.on('end', function() {
            var $ = cheerio.load(html);
            saveFile(proxy, html, url, callback);
        })
    }).on('error', function(err) {
        config.loggerError && console.log(err,url);
        callback(-1);
    });
}

function saveFile(path, data, url, callback){
    fs.writeFile(path, data, function(err) {
        if (err) {
            config.loggerError && console.log('loaded',err,url);
            callback(-1);
        }
        config.logger && console.log('loaded:',url,path);
        callback && callback();
    });
}


// 加载真个配置内容
const loadConfig = (callback) =>{
    let menu = config.menu || [];
    let count = menu.length;
    for(var i = 0 ; i < menu.length;i++){
        let url = menu[i].url;
        if(url){
            config.logger && console.log('beging load :' + url);
            load({ url: url }, (result)=>{
                count = count -1;
                if (count==0){ //  全部执行完毕 则返回本次执行完毕
                    callback();
                }
            });
        }else{
            count = count -1;
        }
    }
    if (count===0){
        callback();
    }
}


function delDir(path){
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(file!=='template.html'){
                console.log(curPath)
                if(fs.statSync(curPath).isDirectory()){
                    // delDir(curPath); //递归删除文件夹 
                } else {
                    fs.unlinkSync(curPath); //删除文件
                }
            }
        });
        // fs.rmdirSync(path); 不执行递归删除 所有扫描都是一级文件
    }
}

// 清理所有文件
const clearFile = ()=>{
    delDir('./scan');
}


// 执行一次扫描
const exeOneScan = (cb)=>{
    clearFile(); // 清空上一次数据
    loadConfig(cb); // 获取下一次数据
}




(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['b'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.config = factory();
    }
}(this, function (b) {
    return exeOneScan;
}));

