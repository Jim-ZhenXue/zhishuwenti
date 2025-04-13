// 声音管理器 - 使用 Web Audio API 生成声音
class SoundManager {
    constructor() {
        this.muted = false;
        
        // 创建音频上下文
        this.audioContext = null;
        
        // 从本地存储中读取静音设置
        const savedMuted = localStorage.getItem('plantTreeSoundMuted');
        if (savedMuted !== null) {
            this.muted = savedMuted === 'true';
        }
        
        // 延迟初始化音频上下文，直到用户交互
        this.initAudioContext();
    }
    
    // 初始化音频上下文
    initAudioContext() {
        // 在首次交互时初始化音频上下文
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                console.log('音频上下文初始化成功');
            } catch (e) {
                console.error('创建音频上下文失败:', e);
            }
        }
    }
    
    // 播放添加树木音效
    playAddTreeSound() {
        if (this.muted || !this.audioContext) return;
        
        try {
            // 创建振荡器
            const oscillator = this.audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4
            oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.2); // A5
            
            // 创建增益节点（音量控制）
            const gainNode = this.audioContext.createGain();
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            // 连接节点
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // 开始播放
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        } catch (e) {
            console.error('播放添加树木音效失败:', e);
        }
    }
    
    // 播放删除树木音效
    playRemoveTreeSound() {
        if (this.muted || !this.audioContext) return;
        
        try {
            // 创建振荡器
            const oscillator = this.audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime); // A5
            oscillator.frequency.exponentialRampToValueAtTime(440, this.audioContext.currentTime + 0.2); // A4
            
            // 创建增益节点（音量控制）
            const gainNode = this.audioContext.createGain();
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            // 连接节点
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // 开始播放
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        } catch (e) {
            console.error('播放删除树木音效失败:', e);
        }
    }
    
    // 播放重置音效
    playResetSound() {
        if (this.muted || !this.audioContext) return;
        
        try {
            // 创建振荡器
            const oscillator1 = this.audioContext.createOscillator();
            oscillator1.type = 'sine';
            oscillator1.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
            
            const oscillator2 = this.audioContext.createOscillator();
            oscillator2.type = 'sine';
            oscillator2.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E5
            
            const oscillator3 = this.audioContext.createOscillator();
            oscillator3.type = 'sine';
            oscillator3.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G5
            
            // 创建增益节点（音量控制）
            const gainNode1 = this.audioContext.createGain();
            gainNode1.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode1.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.05);
            gainNode1.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            const gainNode2 = this.audioContext.createGain();
            gainNode2.gain.setValueAtTime(0, this.audioContext.currentTime + 0.1);
            gainNode2.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.15);
            gainNode2.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
            
            const gainNode3 = this.audioContext.createGain();
            gainNode3.gain.setValueAtTime(0, this.audioContext.currentTime + 0.2);
            gainNode3.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.25);
            gainNode3.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            // 连接节点
            oscillator1.connect(gainNode1);
            gainNode1.connect(this.audioContext.destination);
            
            oscillator2.connect(gainNode2);
            gainNode2.connect(this.audioContext.destination);
            
            oscillator3.connect(gainNode3);
            gainNode3.connect(this.audioContext.destination);
            
            // 开始播放
            oscillator1.start(this.audioContext.currentTime);
            oscillator1.stop(this.audioContext.currentTime + 0.3);
            
            oscillator2.start(this.audioContext.currentTime + 0.1);
            oscillator2.stop(this.audioContext.currentTime + 0.4);
            
            oscillator3.start(this.audioContext.currentTime + 0.2);
            oscillator3.stop(this.audioContext.currentTime + 0.5);
        } catch (e) {
            console.error('播放重置音效失败:', e);
        }
    }
    
    // 播放切换标签页音效
    playSwitchTabSound() {
        if (this.muted || !this.audioContext) return;
        
        try {
            // 创建振荡器
            const oscillator = this.audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime); // E5
            
            // 创建增益节点（音量控制）
            const gainNode = this.audioContext.createGain();
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            // 连接节点
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // 开始播放
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
        } catch (e) {
            console.error('播放切换标签页音效失败:', e);
        }
    }
    
    // 播放信息按钮音效
    playInfoSound() {
        if (this.muted || !this.audioContext) return;
        
        try {
            // 创建振荡器
            const oscillator1 = this.audioContext.createOscillator();
            oscillator1.type = 'sine';
            oscillator1.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4
            
            const oscillator2 = this.audioContext.createOscillator();
            oscillator2.type = 'sine';
            oscillator2.frequency.setValueAtTime(523.25, this.audioContext.currentTime + 0.1); // C5
            
            // 创建增益节点（音量控制）
            const gainNode1 = this.audioContext.createGain();
            gainNode1.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode1.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.05);
            gainNode1.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            const gainNode2 = this.audioContext.createGain();
            gainNode2.gain.setValueAtTime(0, this.audioContext.currentTime + 0.1);
            gainNode2.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.15);
            gainNode2.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            // 连接节点
            oscillator1.connect(gainNode1);
            gainNode1.connect(this.audioContext.destination);
            
            oscillator2.connect(gainNode2);
            gainNode2.connect(this.audioContext.destination);
            
            // 开始播放
            oscillator1.start(this.audioContext.currentTime);
            oscillator1.stop(this.audioContext.currentTime + 0.2);
            
            oscillator2.start(this.audioContext.currentTime + 0.1);
            oscillator2.stop(this.audioContext.currentTime + 0.3);
        } catch (e) {
            console.error('播放信息按钮音效失败:', e);
        }
    }
    
    // 播放滑块调整音效
    playSliderSound() {
        if (this.muted || !this.audioContext) return;
        
        try {
            // 创建振荡器
            const oscillator = this.audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(330, this.audioContext.currentTime); // E4
            
            // 创建增益节点（音量控制）
            const gainNode = this.audioContext.createGain();
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            // 连接节点
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // 开始播放
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } catch (e) {
            console.error('播放滑块调整音效失败:', e);
        }
    }
    
    // 播放音效
    play(name) {
        if (this.muted) return;
        
        // 确保音频上下文已初始化
        this.initAudioContext();
        
        // 根据名称播放相应的音效
        switch (name) {
            case 'addTree':
                this.playAddTreeSound();
                break;
            case 'removeTree':
                this.playRemoveTreeSound();
                break;
            case 'reset':
                this.playResetSound();
                break;
            case 'switchTab':
                this.playSwitchTabSound();
                break;
            case 'info':
                this.playInfoSound();
                break;
            case 'slider':
                this.playSliderSound();
                break;
            default:
                console.warn(`未知的音效名称: ${name}`);
        }
    }
    
    // 切换静音状态
    toggleMute() {
        this.muted = !this.muted;
        
        // 保存设置到本地存储
        localStorage.setItem('plantTreeSoundMuted', this.muted);
        
        return this.muted;
    }
    
    // 获取当前静音状态
    isMuted() {
        return this.muted;
    }
}

// 创建全局声音管理器实例
const soundManager = new SoundManager();
