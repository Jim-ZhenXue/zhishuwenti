// 声音生成器 - 使用 Web Audio API 生成声音
// 这个文件只需要运行一次来生成声音文件，之后可以删除

// 创建音频上下文
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// 生成声音并下载
function generateAndDownloadSound(name, generateFunction) {
    // 创建离线音频上下文（2秒长度，44.1kHz采样率，双声道）
    const offlineContext = new OfflineAudioContext(2, 44100 * 2, 44100);
    
    // 生成声音
    generateFunction(offlineContext);
    
    // 渲染音频
    offlineContext.startRendering().then(buffer => {
        // 创建WAV文件
        const wav = audioBufferToWav(buffer);
        
        // 创建Blob
        const blob = new Blob([wav], { type: 'audio/wav' });
        
        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name}.wav`;
        
        // 添加到页面并触发下载
        document.body.appendChild(link);
        link.click();
        
        // 清理
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    });
}

// 添加树木声音
function generateAddTreeSound(context) {
    // 创建振荡器
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, context.currentTime); // A4
    oscillator.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.2); // A5
    
    // 创建增益节点（音量控制）
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.7, context.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
    
    // 连接节点
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // 开始播放
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.5);
}

// 删除树木声音
function generateRemoveTreeSound(context) {
    // 创建振荡器
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, context.currentTime); // A5
    oscillator.frequency.exponentialRampToValueAtTime(440, context.currentTime + 0.2); // A4
    
    // 创建增益节点（音量控制）
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.7, context.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
    
    // 连接节点
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // 开始播放
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.5);
}

// 重置声音
function generateResetSound(context) {
    // 创建振荡器
    const oscillator1 = context.createOscillator();
    oscillator1.type = 'sine';
    oscillator1.frequency.setValueAtTime(523.25, context.currentTime); // C5
    
    const oscillator2 = context.createOscillator();
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(659.25, context.currentTime + 0.1); // E5
    
    const oscillator3 = context.createOscillator();
    oscillator3.type = 'sine';
    oscillator3.frequency.setValueAtTime(783.99, context.currentTime + 0.2); // G5
    
    // 创建增益节点（音量控制）
    const gainNode1 = context.createGain();
    gainNode1.gain.setValueAtTime(0, context.currentTime);
    gainNode1.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.05);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
    
    const gainNode2 = context.createGain();
    gainNode2.gain.setValueAtTime(0, context.currentTime + 0.1);
    gainNode2.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.15);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.4);
    
    const gainNode3 = context.createGain();
    gainNode3.gain.setValueAtTime(0, context.currentTime + 0.2);
    gainNode3.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.25);
    gainNode3.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
    
    // 连接节点
    oscillator1.connect(gainNode1);
    gainNode1.connect(context.destination);
    
    oscillator2.connect(gainNode2);
    gainNode2.connect(context.destination);
    
    oscillator3.connect(gainNode3);
    gainNode3.connect(context.destination);
    
    // 开始播放
    oscillator1.start(context.currentTime);
    oscillator1.stop(context.currentTime + 0.3);
    
    oscillator2.start(context.currentTime + 0.1);
    oscillator2.stop(context.currentTime + 0.4);
    
    oscillator3.start(context.currentTime + 0.2);
    oscillator3.stop(context.currentTime + 0.5);
}

// 切换标签页声音
function generateSwitchTabSound(context) {
    // 创建振荡器
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(659.25, context.currentTime); // E5
    
    // 创建增益节点（音量控制）
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
    
    // 连接节点
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // 开始播放
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.2);
}

// 信息按钮声音
function generateInfoSound(context) {
    // 创建振荡器
    const oscillator1 = context.createOscillator();
    oscillator1.type = 'sine';
    oscillator1.frequency.setValueAtTime(440, context.currentTime); // A4
    
    const oscillator2 = context.createOscillator();
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(523.25, context.currentTime + 0.1); // C5
    
    // 创建增益节点（音量控制）
    const gainNode1 = context.createGain();
    gainNode1.gain.setValueAtTime(0, context.currentTime);
    gainNode1.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.05);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
    
    const gainNode2 = context.createGain();
    gainNode2.gain.setValueAtTime(0, context.currentTime + 0.1);
    gainNode2.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.15);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
    
    // 连接节点
    oscillator1.connect(gainNode1);
    gainNode1.connect(context.destination);
    
    oscillator2.connect(gainNode2);
    gainNode2.connect(context.destination);
    
    // 开始播放
    oscillator1.start(context.currentTime);
    oscillator1.stop(context.currentTime + 0.2);
    
    oscillator2.start(context.currentTime + 0.1);
    oscillator2.stop(context.currentTime + 0.3);
}

// 滑块调整声音
function generateSliderSound(context) {
    // 创建振荡器
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(330, context.currentTime); // E4
    
    // 创建增益节点（音量控制）
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
    
    // 连接节点
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // 开始播放
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.1);
}

// 将AudioBuffer转换为WAV格式
function audioBufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2;
    const result = new Uint8Array(44 + length);
    
    // RIFF标识
    writeString(result, 0, 'RIFF');
    // 文件长度
    writeUint32(result, 4, 36 + length);
    // WAVE标识
    writeString(result, 8, 'WAVE');
    // fmt标识
    writeString(result, 12, 'fmt ');
    // fmt块长度
    writeUint32(result, 16, 16);
    // 格式类型
    writeUint16(result, 20, 1);
    // 通道数
    writeUint16(result, 22, numOfChan);
    // 采样率
    writeUint32(result, 24, buffer.sampleRate);
    // 字节率
    writeUint32(result, 28, buffer.sampleRate * numOfChan * 2);
    // 块对齐
    writeUint16(result, 32, numOfChan * 2);
    // 位深度
    writeUint16(result, 34, 16);
    // data标识
    writeString(result, 36, 'data');
    // 数据长度
    writeUint32(result, 40, length);
    
    // 写入PCM数据
    const data = result.subarray(44);
    let offset = 0;
    
    for (let i = 0; i < buffer.length; i++) {
        for (let channel = 0; channel < numOfChan; channel++) {
            const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
            const value = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            writeInt16(data, offset, value);
            offset += 2;
        }
    }
    
    return result;
}

// 辅助函数：写入字符串
function writeString(data, offset, string) {
    for (let i = 0; i < string.length; i++) {
        data[offset + i] = string.charCodeAt(i);
    }
}

// 辅助函数：写入16位无符号整数
function writeUint16(data, offset, value) {
    data[offset] = value & 0xFF;
    data[offset + 1] = (value >> 8) & 0xFF;
}

// 辅助函数：写入16位有符号整数
function writeInt16(data, offset, value) {
    writeUint16(data, offset, value < 0 ? value + 0x10000 : value);
}

// 辅助函数：写入32位无符号整数
function writeUint32(data, offset, value) {
    data[offset] = value & 0xFF;
    data[offset + 1] = (value >> 8) & 0xFF;
    data[offset + 2] = (value >> 16) & 0xFF;
    data[offset + 3] = (value >> 24) & 0xFF;
}

// 生成所有声音
function generateAllSounds() {
    generateAndDownloadSound('add-tree', generateAddTreeSound);
    generateAndDownloadSound('remove-tree', generateRemoveTreeSound);
    generateAndDownloadSound('reset', generateResetSound);
    generateAndDownloadSound('switch-tab', generateSwitchTabSound);
    generateAndDownloadSound('info', generateInfoSound);
    generateAndDownloadSound('slider', generateSliderSound);
}

// 创建UI
function createUI() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.left = '20px';
    container.style.backgroundColor = '#222';
    container.style.padding = '20px';
    container.style.borderRadius = '8px';
    container.style.zIndex = '1000';
    container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    
    const title = document.createElement('h2');
    title.textContent = '声音生成器';
    title.style.color = '#fff';
    title.style.marginTop = '0';
    container.appendChild(title);
    
    const generateButton = document.createElement('button');
    generateButton.textContent = '生成所有声音';
    generateButton.style.padding = '10px 20px';
    generateButton.style.backgroundColor = '#10b981';
    generateButton.style.color = '#fff';
    generateButton.style.border = 'none';
    generateButton.style.borderRadius = '4px';
    generateButton.style.cursor = 'pointer';
    generateButton.style.marginTop = '10px';
    generateButton.onclick = generateAllSounds;
    container.appendChild(generateButton);
    
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#ef4444';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginTop = '10px';
    closeButton.style.marginLeft = '10px';
    closeButton.onclick = () => document.body.removeChild(container);
    container.appendChild(closeButton);
    
    document.body.appendChild(container);
}

// 页面加载完成后创建UI
window.addEventListener('DOMContentLoaded', createUI);
