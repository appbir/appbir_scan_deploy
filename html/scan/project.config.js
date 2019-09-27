// 配置的菜单
var menu = [  
    {id:"1",name:"国家市场监督管理总局"},
    { id: "2", name: "机构", url:"http://news.baidu.com/",parent:"1"},
    {id:"3",name:"新闻",url:"http://www.samr.gov.cn/xw/",parent:"1"},
    {id:"4",name:"政务",url:"http://www.samr.gov.cn/zw/",parent:"1"},
]

// 过滤规则
var filter = ['三1','国','机构','政府'];

// 定时刷新时间
var time = 5*1000;

// 服务器配置
var server = {
    ip:'172.17.185.20', // 服务器的IP地址  在启动服务器时候进行配置
    port:'9090', // 服务器端口
}

var config = {
    menu:menu,
    filter:filter,
    time:time,
    logger:false, // 如果不需要打印日志  则设置为false
    reqLogger: true, // true 表示数据交互日志开启
    loggerError:true, // 加载错误打印日志
    server:server,
    getProxy:function(url){
        // 全新建立的路径需要手动创建文件夹
        return './scan/'+url.replace(/\//g,'_').replace(/:/g,'_')+'.html';
    }
};


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['b'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.config = factory();
    }
}(this, function (b) {
    return config;
}));

