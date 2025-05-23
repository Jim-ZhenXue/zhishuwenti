const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 4000; // Standard HTTPS port

// 静态文件服务
app.use(express.static(path.join(__dirname)));

// 添加日志中间件
app.use((req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${clientIP}`);
    next();
});

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// HTTPS 配置
const httpsOptions = {
    key: fs.readFileSync('/ssl/cert.key'),
    cert: fs.readFileSync('/ssl/cert.pem')
};

// 创建 HTTPS 服务器
const server = https.createServer(httpsOptions, app);

// 错误处理
server.on('error', (error) => {
    console.error('Server error:', error);
});

// 启动 HTTPS 服务器
server.listen(port, () => {
    console.log(`HTTPS server running on port ${port}`);
    console.log(`Server directory: ${__dirname}`);
});

// 监听新的连接
server.on('connection', (socket) => {
    console.log(`New connection established from ${socket.remoteAddress}`);
});

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
