// 环形植树功能

// 初始化环形画布
function initCircularCanvas() {
    // 设置画布尺寸
    const container = circularView;
    circularCanvas.width = container.offsetWidth;
    circularCanvas.height = container.offsetHeight;
    
    // 添加鼠标事件支持
    circularCanvas.addEventListener('mousedown', handleCanvasMouseDown);
    circularCanvas.addEventListener('mousemove', handleCanvasMouseMove);
    circularCanvas.addEventListener('mouseup', handleCanvasMouseUp);
    circularCanvas.addEventListener('mouseleave', handleCanvasMouseUp);
    
    // 添加触摸事件支持
    circularCanvas.addEventListener('touchstart', handleCanvasTouchStart, { passive: false });
    circularCanvas.addEventListener('touchmove', handleCanvasTouchMove, { passive: false });
    circularCanvas.addEventListener('touchend', handleCanvasTouchEnd);
}

// 处理画布鼠标按下
function handleCanvasMouseDown(e) {
    const rect = circularCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 检查是否点击了树
    checkCircularTreeClick(x, y);
}

// 处理画布鼠标移动
function handleCanvasMouseMove(e) {
    if (draggingCircularTree !== null && !equalSpacing) {
        const rect = circularCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        moveCircularTreeToPosition(x, y);
    }
}

// 处理画布鼠标松开
function handleCanvasMouseUp() {
    if (draggingCircularTree !== null) {
        draggingCircularTree = null;
        circularTrees.sort((a, b) => a.angle - b.angle);
        renderCircularView();
        updateCircularStats();
    }
}

// 处理画布触摸开始
function handleCanvasTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = circularCanvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    // 检查是否点击了树
    checkCircularTreeClick(x, y);
}

// 处理画布触摸移动
function handleCanvasTouchMove(e) {
    e.preventDefault();
    if (draggingCircularTree !== null && !equalSpacing) {
        const touch = e.touches[0];
        const rect = circularCanvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        moveCircularTreeToPosition(x, y);
    }
}

// 处理画布触摸结束
function handleCanvasTouchEnd() {
    if (draggingCircularTree !== null) {
        draggingCircularTree = null;
        circularTrees.sort((a, b) => a.angle - b.angle);
        renderCircularView();
        updateCircularStats();
    }
}

// 检查是否点击了树
function checkCircularTreeClick(x, y) {
    const centerX = circularCanvas.width / 2;
    const centerY = circularCanvas.height / 2;
    const pixelRadius = Math.min(centerX, centerY) - 50;
    
    for (const tree of circularTrees) {
        const angleRad = (tree.angle * Math.PI) / 180;
        const treeX = centerX + pixelRadius * Math.cos(angleRad);
        const treeY = centerY + pixelRadius * Math.sin(angleRad);
        
        // 计算点击位置与树之间的距离
        const dx = x - treeX;
        const dy = y - treeY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 如果距离小于20像素，认为点击了树
        if (distance < 20) {
            selectCircularTree(tree.id);
            if (!equalSpacing) {
                draggingCircularTree = tree.id;
            }
            return;
        }
    }
}

// 移动树到指定位置
function moveCircularTreeToPosition(x, y) {
    if (draggingCircularTree === null || equalSpacing) return;
    
    const centerX = circularCanvas.width / 2;
    const centerY = circularCanvas.height / 2;
    
    // 计算角度
    const dx = x - centerX;
    const dy = y - centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    
    // 更新树的角度
    circularTrees = circularTrees.map(tree => {
        if (tree.id === draggingCircularTree) {
            return { ...tree, angle };
        }
        return tree;
    });
    
    // 重新渲染
    renderCircularView();
}

// 重新分配环形树的位置（等距离模式）
function redistributeCircularTrees() {
    if (circularTrees.length === 0) return;
    
    const treeCount = circularTrees.length;
    const angleStep = 360 / treeCount;
    
    // 创建新的树数组
    const newTrees = [];
    
    for (let i = 0; i < treeCount; i++) {
        newTrees.push({
            id: circularTrees[i]?.id || nextCircularTreeId + i,
            angle: i * angleStep
        });
    }
    
    // 更新树数组
    circularTrees = newTrees;
    
    // 重新渲染
    renderCircularView();
    updateCircularStats();
}

// 渲染环形视图
function renderCircularView() {
    // 设置画布尺寸
    const container = circularView;
    circularCanvas.width = container.offsetWidth;
    circularCanvas.height = container.offsetHeight;
    
    const ctx = circularCanvas.getContext('2d');
    if (!ctx) return;
    
    // 清空画布
    ctx.clearRect(0, 0, circularCanvas.width, circularCanvas.height);
    
    const centerX = circularCanvas.width / 2;
    const centerY = circularCanvas.height / 2;
    const pixelRadius = Math.min(centerX, centerY) - 50;
    
    // 绘制圆形路径
    ctx.beginPath();
    ctx.arc(centerX, centerY, pixelRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#D97706"; // amber-600
    ctx.lineWidth = 8;
    ctx.stroke();
    
    // 绘制刻度
    for (let i = 0; i < 12; i++) {
        const angle = (i * 30 * Math.PI) / 180;
        const startX = centerX + (pixelRadius - 5) * Math.cos(angle);
        const startY = centerY + (pixelRadius - 5) * Math.sin(angle);
        const endX = centerX + (pixelRadius + 5) * Math.cos(angle);
        const endY = centerY + (pixelRadius + 5) * Math.sin(angle);
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "#78350F"; // amber-900
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // 清除现有的树元素
    const existingTrees = circularView.querySelectorAll('.circular-tree');
    existingTrees.forEach(tree => tree.remove());
    
    // 按角度排序树
    const sortedTrees = [...circularTrees].sort((a, b) => a.angle - b.angle);
    
    // 绘制树木和间隔距离
    sortedTrees.forEach((tree, index) => {
        const angleRad = (tree.angle * Math.PI) / 180;
        const treeX = centerX + pixelRadius * Math.cos(angleRad);
        const treeY = centerY + pixelRadius * Math.sin(angleRad);
        
        // 创建树元素
        const treeElement = document.createElement('div');
        treeElement.className = 'circular-tree';
        treeElement.dataset.id = tree.id;
        treeElement.style.left = `${treeX}px`;
        treeElement.style.top = `${treeY}px`;
        
        // 计算树标签的位置（在圆的外侧）
        const extraDistance = 30; // 标签向外的额外距离
        const labelAngleRad = (tree.angle * Math.PI) / 180;
        const labelX = Math.cos(labelAngleRad) * (pixelRadius + extraDistance);
        const labelY = Math.sin(labelAngleRad) * (pixelRadius + extraDistance);
        
        // 计算标签相对于树的位置
        const relativeLabelX = labelX - pixelRadius * Math.cos(labelAngleRad);
        const relativeLabelY = labelY - pixelRadius * Math.sin(labelAngleRad);
        
        // 创建树的SVG
        treeElement.innerHTML = `
            <svg width="30" height="50" viewBox="0 0 30 50" style="position: absolute; top: -25px; left: -15px;">
                <rect x="12" y="40" width="6" height="10" fill="#8B4513"></rect>
                <polygon points="15,20 5,40.1 25,40.1" fill="#2E8B57" stroke-width="0"></polygon>
                <polygon points="15,15 7,33 23,33" fill="#3CB371" stroke-width="0"></polygon>
                <polygon points="15,10 9,25 21,25" fill="#90EE90" stroke-width="0"></polygon>
            </svg>
            <div style="position: absolute; top: ${relativeLabelY}px; left: ${relativeLabelX}px; background-color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); transform: translate(-50%, -50%);">
                ${index + 1}
            </div>
        `;
        
        // 添加删除按钮（如果树的数量大于2），放在圆的内侧
        if (circularTrees.length > 2) {
            // 计算删除按钮的位置（在圆的内侧）
            const deleteDistance = 20; // 向内的距离
            const deleteAngleRad = (tree.angle * Math.PI) / 180;
            const innerRadius = pixelRadius - deleteDistance;
            const deleteX = Math.cos(deleteAngleRad) * innerRadius - pixelRadius * Math.cos(deleteAngleRad);
            const deleteY = Math.sin(deleteAngleRad) * innerRadius - pixelRadius * Math.sin(deleteAngleRad);
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'tree-delete';
            deleteButton.style.position = 'absolute';
            deleteButton.style.top = `${deleteY}px`;
            deleteButton.style.left = `${deleteX}px`;
            deleteButton.style.transform = 'translate(-50%, -50%)';
            deleteButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
            `;
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                removeCircularTree(tree.id);
            });
            treeElement.appendChild(deleteButton);
        }
        
        // 添加点击事件
        treeElement.addEventListener('click', () => {
            selectCircularTree(tree.id);
        });
        
        // 添加拖拽事件
        treeElement.addEventListener('mousedown', (e) => {
            if (!equalSpacing) {
                startDraggingCircularTree(e, tree.id, centerX, centerY);
            }
        });
        
        circularView.appendChild(treeElement);
        
        // 绘制间隔距离
        if (showCircularDistances && sortedTrees.length > 1) {
            const nextTree = sortedTrees[(index + 1) % sortedTrees.length];
            let angleDiff = nextTree.angle - tree.angle;
            if (angleDiff < 0) angleDiff += 360;
            
            // 根据当前总周长计算弧长距离
            const arcDistance = (angleDiff / 360) * totalDistance;
            const midAngle = ((tree.angle + angleDiff / 2) * Math.PI) / 180;
            const distLabelX = centerX + (pixelRadius - 30) * Math.cos(midAngle);
            const distLabelY = centerY + (pixelRadius - 30) * Math.sin(midAngle);
            
            // 绘制距离标签背景
            ctx.beginPath();
            ctx.roundRect(distLabelX - 20, distLabelY - 10, 40, 20, 5);
            ctx.fillStyle = "#DBEAFE"; // blue-100
            ctx.fill();
            
            // 绘制距离文本
            ctx.font = "10px Arial";
            ctx.fillStyle = "#1E40AF"; // blue-800
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${Math.round(arcDistance * 10) / 10}米`, distLabelX, distLabelY);
        }
    });
}

// 添加环形树
function addCircularTree() {
    if (equalSpacing) {
        // 等距离模式：添加一棵树并重新分布
        const newId = nextCircularTreeId++;
        circularTrees.push({ id: newId, angle: 0 });
        redistributeCircularTrees();
    } else {
        // 非等距离模式：找到最大间隔并在中间添加树
        let maxGap = 0;
        let gapAngle = 0;
        
        const sortedTrees = [...circularTrees].sort((a, b) => a.angle - b.angle);
        
        for (let i = 0; i < sortedTrees.length; i++) {
            const nextIndex = (i + 1) % sortedTrees.length;
            let angleDiff = sortedTrees[nextIndex].angle - sortedTrees[i].angle;
            if (angleDiff < 0) angleDiff += 360;
            
            if (angleDiff > maxGap) {
                maxGap = angleDiff;
                gapAngle = (sortedTrees[i].angle + angleDiff / 2) % 360;
            }
        }
        
        circularTrees.push({ id: nextCircularTreeId++, angle: gapAngle });
        renderCircularView();
        updateCircularStats();
    }
}

// 删除环形树
function removeCircularTree(id) {
    if (circularTrees.length <= 2) return; // 至少保留两棵树
    
    circularTrees = circularTrees.filter(tree => tree.id !== id);
    
    if (equalSpacing) {
        redistributeCircularTrees();
    } else {
        renderCircularView();
        updateCircularStats();
    }
    
    if (selectedCircularTree === id) {
        selectedCircularTree = null;
    }
}

// 选择环形树
function selectCircularTree(id) {
    selectedCircularTree = id;
    
    // 更新选中状态
    document.querySelectorAll('.circular-tree').forEach(tree => {
        if (parseInt(tree.dataset.id) === id) {
            tree.classList.add('selected');
        } else {
            tree.classList.remove('selected');
        }
    });
}

// 开始拖拽环形树
function startDraggingCircularTree(e, id, centerX, centerY) {
    if (equalSpacing) return;
    
    e.preventDefault();
    
    const treeElement = document.querySelector(`.circular-tree[data-id="${id}"]`);
    if (!treeElement) return;
    
    draggingCircularTree = id;
    treeElement.classList.add('dragging');
    
    // 添加鼠标移动和释放事件
    document.addEventListener('mousemove', moveCircularTree);
    document.addEventListener('mouseup', stopDraggingCircularTree);
    
    function moveCircularTree(e) {
        if (!draggingCircularTree) return;
        
        const rect = circularCanvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 计算角度
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        if (angle < 0) angle += 360;
        
        // 更新树的角度
        circularTrees = circularTrees.map(tree => {
            if (tree.id === id) {
                return { ...tree, angle };
            }
            return tree;
        });
        
        // 重新渲染
        renderCircularView();
    }
    
    function stopDraggingCircularTree() {
        if (!draggingCircularTree) return;
        
        draggingCircularTree = null;
        
        // 移除事件监听器
        document.removeEventListener('mousemove', moveCircularTree);
        document.removeEventListener('mouseup', stopDraggingCircularTree);
        
        // 重新排序树并更新视图
        circularTrees.sort((a, b) => a.angle - b.angle);
        renderCircularView();
        updateCircularStats();
    }
}

// 切换显示/隐藏环形距离
function toggleCircularDistances() {
    showCircularDistances = !showCircularDistances;
    // 更新按钮文本
    const button = document.getElementById('toggle-circular-distances');
    button.textContent = showCircularDistances ? '隐藏距离' : '显示距离';
    renderCircularView();
    console.log('Toggled circular distances:', showCircularDistances);
}

// 更新环形植树统计
function updateCircularStats() {
    const treeCount = circularTrees.length;
    const intervalCount = treeCount;
    
    // 确保使用当前的总周长计算平均间隔距离
    const avgDistance = Math.round((totalDistance / intervalCount) * 10) / 10;
    
    // 更新显示的统计数据
    circularTreeCount.textContent = `${treeCount}棵`;
    circularIntervalCount.textContent = `${intervalCount}个`;
    circularAvgDistance.textContent = `${avgDistance}米`;
    
    // 更新公式显示
    circularFormula1.textContent = `${treeCount} = ${intervalCount}`;
    circularFormula2.textContent = `${totalDistance} ÷ ${treeCount} = ${avgDistance}米`;
    
    // 更新平均间隔距离的显示
    document.getElementById('circular-avg-distance').textContent = `${avgDistance}米`;
    
    console.log('Updated circular stats:', { totalDistance, treeCount, avgDistance });
}
