// 线性植树功能

// 重新分配线性树的位置（等距离模式）
function redistributeLinearTrees() {
    if (linearTrees.length <= 1) return;
    
    // 只保留两端植树模式
    redistributeBothEnds();
    
    // 重新渲染
    renderLinearTrees();
    updateLinearStats();
}

// 两端都种树的情况
function redistributeBothEnds() {
    // 如果只有两棵树，直接放在两端
    if (linearTrees.length === 2) {
        linearTrees = [
            { id: linearTrees[0].id, position: 0 },  // 左端点
            { id: linearTrees[1].id, position: 100 }  // 右端点
        ];
        return;
    } else if (linearTrees.length < 2) {
        return;
    }
    
    // 保留起点和终点，并将它们放在精确的端点位置（0%和100%）
    const startTree = { id: linearTrees[0].id, position: 0 };
    const endTree = { id: linearTrees[linearTrees.length - 1].id, position: 100 };
    
    // 计算中间树的数量和间距
    const innerTreeCount = linearTrees.length - 2;
    
    // 确保每个间隔的实际距离相等
    const intervalCount = linearTrees.length - 1;
    const step = 100 / intervalCount;
    
    // 创建新的树数组
    const newTrees = [startTree];
    
    // 添加中间的树
    for (let i = 0; i < innerTreeCount; i++) {
        const innerTreeId = linearTrees.filter(t => t.id !== startTree.id && t.id !== endTree.id)[i]?.id || (nextLinearTreeId + i);
        newTrees.push({ id: innerTreeId, position: step * (i + 1) });
    }
    
    // 添加终点树
    newTrees.push(endTree);
    
    // 更新树数组
    linearTrees = newTrees;
}

// 移除其他种植模式函数，只保留两端植树模式

// 渲染线性树
function renderLinearTrees() {
    // 清除现有的树和距离标签
    const existingTrees = linearView.querySelectorAll('.tree');
    const existingLabels = linearView.querySelectorAll('.distance-label');
    
    existingTrees.forEach(tree => tree.remove());
    existingLabels.forEach(label => label.remove());
    
    // 按位置排序树
    const sortedTrees = [...linearTrees].sort((a, b) => a.position - b.position);
    
    // 渲染每棵树
    sortedTrees.forEach((tree, index) => {
        const treeElement = document.createElement('div');
        treeElement.className = 'tree';
        treeElement.dataset.id = tree.id;
        treeElement.style.left = `${tree.position}%`;
        
        // 创建树的SVG，为第一棵和最后一棵树特殊处理偏移量，确保完全显示
        const isFirstTree = index === 0;
        const isLastTree = index === sortedTrees.length - 1;
        let translateX = '-15px'; // 默认中间树的偏移
        
        if (isFirstTree) {
            translateX = '0px'; // 第一棵树不偏移，确保左侧可见
        } else if (isLastTree) {
            translateX = '-30px'; // 最后一棵树向左偏移更多，确保右侧可见
        }
        
        // 创建树的SVG元素
        treeElement.innerHTML = `
            <svg width="30" height="50" viewBox="0 0 30 50" style="transform: translateX(${translateX});">
                <rect x="12" y="40" width="6" height="10" fill="#8B4513"></rect>
                <polygon points="15,20 5,40.1 25,40.1" fill="#2E8B57" stroke-width="0"></polygon>
                <polygon points="15,15 7,33 23,33" fill="#3CB371" stroke-width="0"></polygon>
                <polygon points="15,10 9,25 21,25" fill="#90EE90" stroke-width="0"></polygon>
            </svg>
        `;
        
        // 移除树的编号标签
        
        // 只为非起点终点的树添加删除按钮
        if (tree.id !== 1 && tree.id !== 2) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'tree-delete';
            deleteButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
            `;
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                removeLinearTree(tree.id);
            });
            treeElement.appendChild(deleteButton);
        }
        
        // 添加点击事件
        treeElement.addEventListener('click', () => {
            selectLinearTree(tree.id);
        });
        
        // 添加拖拽事件
        treeElement.addEventListener('mousedown', (e) => {
            if (false) { // 不再允许拖拽任何树
                startDraggingLinearTree(e, tree.id);
            }
        });
        
        linearView.appendChild(treeElement);
    });
    
    // 渲染距离标签
    if (showLinearDistances) {
        // 计算树所跨越的百分比范围
        const firstTree = sortedTrees[0];
        const lastTree = sortedTrees[sortedTrees.length - 1];
        const totalSpan = lastTree.position - firstTree.position;
        
        // 根据不同的种植模式计算间隔数
        let intervalCount;
        switch (plantingMode) {
            case 'both-ends':
                // 两端都种树时：间隔数 = 树的数量 - 1
                intervalCount = Math.max(1, sortedTrees.length - 1);
                break;
            case 'one-end':
                // 只在一端种树时：间隔数 = 树的数量
                intervalCount = sortedTrees.length;
                break;
            case 'no-ends':
                // 两端都不种树时：间隔数 = 树的数量 + 1
                intervalCount = sortedTrees.length + 1;
                break;
            default:
                intervalCount = Math.max(1, sortedTrees.length - 1);
        }
        
        // 计算每个间隔的实际距离
        const avgDistance = Math.round((totalDistance / intervalCount) * 10) / 10;
        
        // 根据不同的种植模式渲染距离标签
        if (plantingMode === 'no-ends') {
            // 两端不种树模式：需要在两端也显示距离标签
            
            // 左侧空白区域的标签
            const leftLabel = document.createElement('div');
            leftLabel.className = 'distance-label';
            leftLabel.style.left = `${(0 + firstTree.position) / 2}%`;
            leftLabel.textContent = `${avgDistance}米`;
            linearView.appendChild(leftLabel);
            
            // 树之间的距离标签
            for (let i = 0; i < sortedTrees.length - 1; i++) {
                const currentTree = sortedTrees[i];
                const nextTree = sortedTrees[i + 1];
                const midPosition = (currentTree.position + nextTree.position) / 2;
                
                const distanceLabel = document.createElement('div');
                distanceLabel.className = 'distance-label';
                distanceLabel.style.left = `${midPosition}%`;
                distanceLabel.textContent = `${avgDistance}米`;
                
                linearView.appendChild(distanceLabel);
            }
            
            // 右侧空白区域的标签
            const rightLabel = document.createElement('div');
            rightLabel.className = 'distance-label';
            rightLabel.style.left = `${(lastTree.position + 100) / 2}%`;
            rightLabel.textContent = `${avgDistance}米`;
            linearView.appendChild(rightLabel);
            
        } else if (plantingMode === 'one-end') {
            // 一端种树模式：需要在右端显示距离标签
            
            // 树之间的距离标签
            for (let i = 0; i < sortedTrees.length - 1; i++) {
                const currentTree = sortedTrees[i];
                const nextTree = sortedTrees[i + 1];
                const midPosition = (currentTree.position + nextTree.position) / 2;
                
                const distanceLabel = document.createElement('div');
                distanceLabel.className = 'distance-label';
                distanceLabel.style.left = `${midPosition}%`;
                distanceLabel.textContent = `${avgDistance}米`;
                
                linearView.appendChild(distanceLabel);
            }
            
            // 右侧空白区域的标签
            const rightLabel = document.createElement('div');
            rightLabel.className = 'distance-label';
            rightLabel.style.left = `${(lastTree.position + 100) / 2}%`;
            rightLabel.textContent = `${avgDistance}米`;
            linearView.appendChild(rightLabel);
            
        } else {
            // 两端种树模式：只显示树之间的距离标签
            for (let i = 0; i < sortedTrees.length - 1; i++) {
                const currentTree = sortedTrees[i];
                const nextTree = sortedTrees[i + 1];
                const midPosition = (currentTree.position + nextTree.position) / 2;
                
                const distanceLabel = document.createElement('div');
                distanceLabel.className = 'distance-label';
                distanceLabel.style.left = `${midPosition}%`;
                distanceLabel.textContent = `${avgDistance}米`;
                
                linearView.appendChild(distanceLabel);
            }
        }
    }
}

// 添加线性树
function addLinearTree() {
    // 根据不同的种植模式添加树
    const newId = nextLinearTreeId++;
    
    // 只保留两端植树模式
    if (linearTrees.length === 2) {
        linearTrees.push({ id: newId, position: 50 });
    } else {
        linearTrees.push({ id: newId, position: 50 });
    }
    
    // 重新分配树的位置
    redistributeLinearTrees();
    
    // 播放添加树木音效
    if (typeof soundManager !== 'undefined') {
        soundManager.play('addTree');
    }
}

// 删除线性树
function removeLinearTree(id) {
    // 根据不同的种植模式处理删除限制
    switch (plantingMode) {
        case 'both-ends':
            // 两端种树模式，不能删除第一棵和最后一棵树
            if (linearTrees.length <= 2) return; // 至少保留两棵树
            
            // 只保护第一棵树（左端树），允许删除最后一棵树（右端树）
            const firstTreeId = linearTrees[0].id;
            if (id === firstTreeId) return;
            break;
        case 'one-end':
            // 一端种树模式，不能删除第一棵树
            if (linearTrees.length <= 1) return; // 至少保留一棵树
            
            // 不允许删除第一棵树
            if (id === linearTrees[0].id) return;
            break;
        case 'no-ends':
            // 两端不种树模式，至少保留一棵树
            if (linearTrees.length <= 1) return;
            break;
    }
    
    // 删除指定树
    linearTrees = linearTrees.filter(tree => tree.id !== id);
    
    // 重新分配树的位置
    redistributeLinearTrees();
    
    if (selectedLinearTree === id) {
        selectedLinearTree = null;
    }
    
    // 播放删除树木音效
    if (typeof soundManager !== 'undefined') {
        soundManager.play('removeTree');
    }
}

// 选择线性树
function selectLinearTree(id) {
    selectedLinearTree = id;
    
    // 更新选中状态
    document.querySelectorAll('.tree').forEach(tree => {
        if (parseInt(tree.dataset.id) === id) {
            tree.classList.add('selected');
        } else {
            tree.classList.remove('selected');
        }
    });
}

// 开始拖拽线性树
function startDraggingLinearTree(e, id) {
    // 不允许拖拽任何树，因为我们始终使用等距离模式
    return;
    
    e.preventDefault();
    
    const treeElement = document.querySelector(`.tree[data-id="${id}"]`);
    if (!treeElement) return;
    
    draggingLinearTree = id;
    treeElement.classList.add('dragging');
    
    // 记录起始位置
    const startX = e.clientX;
    const treePosition = linearTrees.find(tree => tree.id === id).position;
    const viewRect = linearView.getBoundingClientRect();
    
    // 添加鼠标移动和释放事件
    document.addEventListener('mousemove', moveLinearTree);
    document.addEventListener('mouseup', stopDraggingLinearTree);
    
    function moveLinearTree(e) {
        if (!draggingLinearTree) return;
        
        const deltaX = e.clientX - startX;
        const deltaPercent = (deltaX / viewRect.width) * 100;
        const newPosition = Math.max(2, Math.min(98, treePosition + deltaPercent));
        
        // 更新树的位置
        linearTrees = linearTrees.map(tree => {
            if (tree.id === id) {
                return { ...tree, position: newPosition };
            }
            return tree;
        });
        
        // 更新树的视觉位置
        treeElement.style.left = `${newPosition}%`;
    }
    
    function stopDraggingLinearTree() {
        if (!draggingLinearTree) return;
        
        draggingLinearTree = null;
        treeElement.classList.remove('dragging');
        
        // 移除事件监听器
        document.removeEventListener('mousemove', moveLinearTree);
        document.removeEventListener('mouseup', stopDraggingLinearTree);
        
        // 重新排序树并更新视图
        linearTrees.sort((a, b) => a.position - b.position);
        renderLinearTrees();
        updateLinearStats();
    }
}

// 切换显示/隐藏线性距离
function toggleLinearDistances() {
    showLinearDistances = !showLinearDistances;
    // 更新按钮文本
    const button = document.getElementById('toggle-linear-distances');
    button.textContent = showLinearDistances ? '隐藏距离' : '显示距离';
    
    // 按钮点击后自动失去焦点，避免保持白底状态
    button.blur();
    
    // 隐藏或显示间隔距离统计
    const avgDistanceStat = document.getElementById('linear-avg-distance').closest('.stat');
    if (avgDistanceStat) {
        // 使用visibility而不是display来隐藏，保持元素占位不变
        avgDistanceStat.style.visibility = showLinearDistances ? 'visible' : 'hidden';
    }
    
    // 播放按钮音效
    if (typeof soundManager !== 'undefined') {
        soundManager.play('info');
    }
    
    renderLinearTrees();
    console.log('Toggled linear distances:', showLinearDistances);
}

// 更新线性植树统计
function updateLinearStats() {
    const treeCount = linearTrees.length;
    
    // 只保留两端植树模式：间隔数 = 树的数量 - 1
    const intervalCount = Math.max(1, treeCount - 1);
    
    // 计算平均距离
    const avgDistance = Math.round((totalDistance / intervalCount) * 10) / 10;
    
    // 更新统计显示
    linearTreeCount.textContent = `${treeCount}棵`;
    linearIntervalCount.textContent = `${intervalCount}个`;
    linearAvgDistance.textContent = `${avgDistance}米`;
    
    // 直接更新平均间隔距离的显示
    document.getElementById('linear-avg-distance').textContent = `${avgDistance}米`;
    
    console.log('Updated linear stats:', { totalDistance, treeCount, intervalCount, avgDistance, plantingMode });
}
