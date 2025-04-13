// 全局变量
let plantingType = 'linear'; // 'linear' 或 'circular'
let totalDistance = 200; // 总距离（米）
// Equal spacing is now always enabled by default
const plantingMode = 'both-ends'; // 只保留两端植树模式

// 线性植树变量
let linearTrees = [
    { id: 1, position: 2 }, // 起点
    { id: 2, position: 98 } // 终点
];
let nextLinearTreeId = 3;
let selectedLinearTree = null;
let draggingLinearTree = null;
let showLinearDistances = true;

// 环形植树变量
let circularTrees = [
    { id: 1, angle: 0 },
    { id: 2, angle: 90 },
    { id: 3, angle: 180 },
    { id: 4, angle: 270 }
];
let nextCircularTreeId = 5;
let selectedCircularTree = null;
let draggingCircularTree = null;
let showCircularDistances = true;

// DOM 元素
const linearTab = document.getElementById('linear-tab');
const circularTab = document.getElementById('circular-tab');
const distanceLabel = document.getElementById('distance-label');
const totalDistanceSlider = document.getElementById('total-distance');
const distanceValue = document.getElementById('distance-value');
const resetButton = document.getElementById('reset-button');

const linearPlanting = document.getElementById('linear-planting');
const circularPlanting = document.getElementById('circular-planting');
const linearView = document.getElementById('linear-view');
const circularView = document.getElementById('circular-view');
const circularCanvas = document.getElementById('circular-canvas');
const addLinearTreeButton = document.getElementById('add-linear-tree');
const addCircularTreeButton = document.getElementById('add-circular-tree');
const toggleLinearDistancesButton = document.getElementById('toggle-linear-distances');
const toggleCircularDistancesButton = document.getElementById('toggle-circular-distances');
const linearTreeCount = document.getElementById('linear-tree-count');
const linearIntervalCount = document.getElementById('linear-interval-count');
const linearAvgDistance = document.getElementById('linear-avg-distance');
const circularTreeCount = document.getElementById('circular-tree-count');
const circularIntervalCount = document.getElementById('circular-interval-count');
const circularAvgDistance = document.getElementById('circular-avg-distance');

const infoButton = document.getElementById('info-button');
const infoDialog = document.getElementById('info-dialog');
const closeDialogButton = document.getElementById('close-dialog');

// 初始化
function init() {
    // 移除黄色线条
    
    // 初始化线性植树视图
    renderLinearTrees();
    updateLinearStats();
    
    // 初始化环形植树视图
    initCircularCanvas();
    renderCircularView();
    updateCircularStats();
    
    // 初始化按钮文本
    toggleLinearDistancesButton.textContent = showLinearDistances ? '隐藏距离' : '显示距离';
    toggleCircularDistancesButton.textContent = showCircularDistances ? '隐藏距离' : '显示距离';
    
    // 初始化声音图标
    updateSoundIcon();
    
    // 设置事件监听器
    setupEventListeners();
}

// 设置事件监听器
function setupEventListeners() {
    // 标签页切换
    linearTab.addEventListener('click', () => switchPlantingType('linear'));
    circularTab.addEventListener('click', () => switchPlantingType('circular'));
    
    // 移除种植模式切换监听器，因为我们只保留了两端植树模式
    
    // 总距离滑块 - 使用input事件实时更新
    totalDistanceSlider.addEventListener('input', function(e) {
        // 获取新的总距离值
        totalDistance = parseInt(e.target.value);
        distanceValue.textContent = `${totalDistance}米`;
        
        // 先更新统计数据（这是轻量级操作）
        if (plantingType === 'linear') {
            updateLinearStats();
        } else {
            updateCircularStats();
        }
        
        // 使用requestAnimationFrame来优化渲染性能
        if (!window.sliderAnimationFrame) {
            window.sliderAnimationFrame = requestAnimationFrame(function() {
                // 重新渲染视图
                if (plantingType === 'linear') {
                    renderLinearTrees();
                } else {
                    renderCircularView();
                }
                
                // 总是重新分配树的位置以保持等距离
                redistributeTrees();
                
                window.sliderAnimationFrame = null;
            });
        }
    });
    
    // 重置按钮
    resetButton.addEventListener('click', resetSimulation);
    

    
    // 添加树按钮
    addLinearTreeButton.addEventListener('click', addLinearTree);
    addCircularTreeButton.addEventListener('click', addCircularTree);
    
    // 注意：显示/隐藏距离按钮的点击事件已经在HTML中通过onclick属性设置
    
    // 信息对话框
    infoButton.addEventListener('click', showInfoDialog);
    closeDialogButton.addEventListener('click', hideInfoDialog);
    infoDialog.addEventListener('click', (e) => {
        if (e.target === infoDialog) {
            hideInfoDialog();
        }
    });
    
    // 窗口大小变化时重新渲染环形视图
    window.addEventListener('resize', () => {
        if (plantingType === 'circular') {
            renderCircularView();
        }
    });
}

// 切换植树类型
function switchPlantingType(type) {
    // 如果已经是当前类型，不做任何操作
    if (plantingType === type) return;
    
    plantingType = type;
    
    // 播放切换标签页音效
    if (typeof soundManager !== 'undefined') {
        soundManager.play('switchTab');
    }
    
    // 更新标签页状态
    linearTab.classList.toggle('active', type === 'linear');
    circularTab.classList.toggle('active', type === 'circular');
    
    // 更新视图显示
    linearPlanting.classList.toggle('active', type === 'linear');
    circularPlanting.classList.toggle('active', type === 'circular');
    
    // 更新距离标签
    distanceLabel.textContent = type === 'linear' ? '长度' : '周长';
    
    // 如果切换到环形，确保重新渲染
    if (type === 'circular') {
        // 确保画布尺寸正确
        const container = circularView;
        circularCanvas.width = container.offsetWidth;
        circularCanvas.height = container.offsetHeight;
        renderCircularView();
    }
    
    console.log('Switched to:', type);
}

// 处理总距离变化
function handleDistanceChange() {
    // 获取新的总距离值
    totalDistance = parseInt(totalDistanceSlider.value);
    distanceValue.textContent = `${totalDistance}米`;
    
    // 播放滑块调整音效
    if (typeof soundManager !== 'undefined') {
        soundManager.play('slider');
    }
    
    // 始终更新统计，无论树的数量或模式
    if (plantingType === 'linear') {
        updateLinearStats(); // 更新线性植树统计
        renderLinearTrees(); // 重新渲染线性植树
    } else {
        updateCircularStats(); // 更新环形植树统计
        renderCircularView(); // 重新渲染环形植树
    }
    
    // 如果是等距离模式，还需要重新分配树的位置
    if (equalSpacing) {
        redistributeTrees();
    }
    
    // 直接强制更新平均间隔距离显示
    if (plantingType === 'linear') {
        const treeCount = linearTrees.length;
        const intervalCount = Math.max(1, treeCount - 1);
        
        // When there are exactly 2 trees, the average distance is exactly the total distance
        let avgDistance;
        if (treeCount === 2) {
            avgDistance = totalDistance;
        } else {
            avgDistance = Math.round((totalDistance / intervalCount) * 10) / 10;
        }
        
        document.getElementById('linear-avg-distance').textContent = `${avgDistance}米`;
    } else {
        const treeCount = circularTrees.length;
        const intervalCount = Math.max(1, treeCount);
        const avgDistance = Math.round((totalDistance / intervalCount) * 10) / 10;
        document.getElementById('circular-avg-distance').textContent = `${avgDistance}米`;
    }
    
    console.log('Total distance changed to:', totalDistance, 'Current mode:', plantingType);
}

// 重置模拟
function resetSimulation() {
    totalDistance = 200;
    totalDistanceSlider.value = 200;
    distanceValue.textContent = '200米';
    
    // 只保留两端植树模式
    // plantingMode 已经设置为常量
    
    // 重置线性植树
    resetLinearTrees();
    selectedLinearTree = null;
    showLinearDistances = true;
    toggleLinearDistancesButton.textContent = '隐藏距离';
    
    // 重置环形植树
    circularTrees = [
        { id: 1, angle: 0 },
        { id: 2, angle: 90 },
        { id: 3, angle: 180 },
        { id: 4, angle: 270 }
    ];
    nextCircularTreeId = 5;
    selectedCircularTree = null;
    showCircularDistances = true;
    toggleCircularDistancesButton.textContent = '隐藏距离';
    
    // 播放重置音效
    soundManager.play('reset');
    
    // 重新渲染
    renderLinearTrees();
    updateLinearStats();
    renderCircularView();
    updateCircularStats();
}

// 重新分配树（根据当前植树类型）
function redistributeTrees() {
    if (plantingType === 'linear') {
        redistributeLinearTrees();
    } else {
        redistributeCircularTrees();
    }
}

// 移除切换种植模式函数，因为只保留两端植树模式

// 重置线性植树
function resetLinearTrees() {
    // 只保留两端植树模式
    linearTrees = [
        { id: 1, position: 2 },
        { id: 2, position: 98 }
    ];
    nextLinearTreeId = 3;
    
    renderLinearTrees();
    updateLinearStats();
}

// 显示信息对话框
function showInfoDialog() {
    infoDialog.classList.add('active');
    
    // 播放信息按钮音效
    soundManager.play('info');
}

// 隐藏信息对话框
function hideInfoDialog() {
    infoDialog.classList.remove('active');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 切换声音状态
function toggleSound() {
    const muted = soundManager.toggleMute();
    updateSoundIcon();
    
    // 如果刚刚取消静音，播放一个音效作为反馈
    if (!muted) {
        soundManager.play('switchTab');
    }
}

// 更新声音图标
function updateSoundIcon() {
    const soundIcon = document.getElementById('sound-icon');
    if (soundManager.isMuted()) {
        // 显示静音图标
        soundIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
    } else {
        // 显示有声图标
        soundIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>';
    }
}
