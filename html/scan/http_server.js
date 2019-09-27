/**
 * 后端启动一个http服务器 为web提供服务
 */

var config = require('./project.config.js');
var exeOneScan = require('./scan_server.js');
//1. 加载 http 核心模块
var http = require('http');

// 2. 使用 http.createServer() 方法创建一个 Web 服务器
//    返回一个 Server 实例
var server = http.createServer();




//    注册 request 请求事件
//    当客户端请求过来，就会自动触发服务器的 request 请求事件，然后执行第二个参数：回调处理函数
// request 请求事件处理函数，需要接收两个参数：
//    Request 请求对象
//        请求对象可以用来获取客户端的一些请求信息，例如请求路径
//    Response 响应对象
//        响应对象可以用来给客户端发送响应消息
server.on('request', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin','*'); // 设置同源策略

    config.reqLogger && console.log('收到客户%s%s请求:%s', req.socket.remoteAddress, req.socket.remotePort, req.url);
    if (req.url === '/scan'){
        exeOneScan(function(){
            res.write('sucess');
            res.end();
            config.reqLogger && console.log('扫描完毕！');
        })
    }else{
        res.write('unkonwn');
        res.end()
    }
})

// 获取本机的ip地址
var getLocalIP = function () {
    const os = require('os');
    const ifaces = os.networkInterfaces();
    let locatIp = '';
    for (let dev in ifaces) {
        if (dev === '本地连接') {
            for (let j = 0; j < ifaces[dev].length; j++) {
                if (ifaces[dev][j].family === 'IPv4') {
                    locatIp = ifaces[dev][j].address;
                    break;
                }
            }
        }
    }
    return locatIp;
}

server.listen(config.server.port, function () {
    console.log('服务器启动成功了，可以通过 http://%s:%s来进行访问...', getLocalIP(), config.server.port);
})

