// 全局变量
let plantingType = 'linear'; // 'linear' 或 'circular'
let totalDistance = 200; // 总距离（米）
let equalSpacing = true; // 是否等距离种植

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
const equalSpacingCheckbox = document.getElementById('equal-spacing');
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
const linearFormula1 = document.getElementById('linear-formula-1');
const linearFormula2 = document.getElementById('linear-formula-2');
const linearFormula3 = document.getElementById('linear-formula-3');
const circularFormula1 = document.getElementById('circular-formula-1');
const circularFormula2 = document.getElementById('circular-formula-2');
const infoButton = document.getElementById('info-button');
const infoDialog = document.getElementById('info-dialog');
const closeDialogButton = document.getElementById('close-dialog');

// 初始化
function init() {
    // 创建地面
    const ground = document.createElement('div');
    ground.className = 'ground';
    linearView.appendChild(ground);
    
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
    
    // 设置事件监听器
    setupEventListeners();
}

// 设置事件监听器
function setupEventListeners() {
    // 标签页切换
    linearTab.addEventListener('click', () => switchPlantingType('linear'));
    circularTab.addEventListener('click', () => switchPlantingType('circular'));
    
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
                
                // 如果是等距离模式，还需要重新分配树的位置
                if (equalSpacing) {
                    redistributeTrees();
                }
                
                window.sliderAnimationFrame = null;
            });
        }
    });
    
    // 重置按钮
    resetButton.addEventListener('click', resetSimulation);
    
    // 等距离种植复选框
    equalSpacingCheckbox.addEventListener('change', () => {
        equalSpacing = equalSpacingCheckbox.checked;
        if (equalSpacing) {
            redistributeTrees();
        }
    });
    
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
    plantingType = type;
    
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
    
    equalSpacing = true;
    equalSpacingCheckbox.checked = true;
    
    // 重置线性植树
    linearTrees = [
        { id: 1, position: 2 },
        { id: 2, position: 98 }
    ];
    nextLinearTreeId = 3;
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

// 显示信息对话框
function showInfoDialog() {
    infoDialog.classList.add('active');
}

// 隐藏信息对话框
function hideInfoDialog() {
    infoDialog.classList.remove('active');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
