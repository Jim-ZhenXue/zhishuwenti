const express = require('express');
const path = require('path');

// 创建Express应用
const app = express();

// 配置端口
const port = process.env.PORT || 4000;

// 静态文件服务
app.use(express.static(path.join(__dirname)));

// 添加日志中间件
app.use((req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${clientIP}`);
    next();
});

// 健康检查端点
app.get('/health', (req, res) => {  
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 创建HTTP服务器
const server = app.listen(port, () => {
    console.log(`HTTP Server is running at http://localhost:${port}`);
});

// 错误处理
server.on('error', (error) => {
    console.error('Server error:', error);
});

// 启动服务器
// 监听新的连接
server.on('connection', (socket) => {
    console.log(`New connection established from ${socket.remoteAddress}`);
});

module.exports = { app, server };

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('Received SIGTERM signal. Starting graceful shutdown...');
    server.close(() => {
        console.log('Server shut down gracefully');
        process.exit(0);
    });
});

// 未捕获的异常处理
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
