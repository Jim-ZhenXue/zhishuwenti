// 线性植树功能

// 重新分配线性树的位置（等距离模式）
function redistributeLinearTrees() {
    if (linearTrees.length <= 2) return;
    
    // 保留起点和终点，但确保它们在视图范围内（2%和98%位置）
    const startTree = { id: linearTrees[0].id, position: 2 };
    const endTree = { id: linearTrees[linearTrees.length - 1].id, position: 98 };
    
    // 计算中间树的数量和间距（考虑到起点和终点的新位置）
    const innerTreeCount = linearTrees.length - 2;
    const step = (98 - 2) / (innerTreeCount + 1);
    
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
    
    // 重新渲染
    renderLinearTrees();
    updateLinearStats();
}

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
        
        // 单独创建树标签元素，确保它位于树的正下方
        const treeLabel = document.createElement('div');
        treeLabel.className = 'tree-label';
        treeLabel.textContent = `树 ${index + 1}`;
        treeElement.appendChild(treeLabel);
        
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
            if (tree.id !== 1 && tree.id !== 2 && !equalSpacing) {
                startDraggingLinearTree(e, tree.id);
            }
        });
        
        linearView.appendChild(treeElement);
    });
    
    // 渲染距离标签
    if (showLinearDistances) {
        for (let i = 0; i < sortedTrees.length - 1; i++) {
            const currentTree = sortedTrees[i];
            const nextTree = sortedTrees[i + 1];
            const midPosition = (currentTree.position + nextTree.position) / 2;
            const distance = ((nextTree.position - currentTree.position) / 100) * totalDistance;
            
            const distanceLabel = document.createElement('div');
            distanceLabel.className = 'distance-label';
            distanceLabel.style.left = `${midPosition}%`;
            distanceLabel.textContent = `${Math.round(distance * 10) / 10}米`;
            
            linearView.appendChild(distanceLabel);
        }
    }
}

// 添加线性树
function addLinearTree() {
    if (equalSpacing) {
        // 等距离模式：添加一棵树并重新分布
        const newId = nextLinearTreeId++;
        linearTrees.push({ id: newId, position: 50 });
        redistributeLinearTrees();
    } else {
        // 非等距离模式：找到最大间隔并在中间添加树
        let maxGap = 0;
        let gapPosition = 50;
        
        const sortedTrees = [...linearTrees].sort((a, b) => a.position - b.position);
        
        for (let i = 0; i < sortedTrees.length - 1; i++) {
            const gap = sortedTrees[i + 1].position - sortedTrees[i].position;
            if (gap > maxGap) {
                maxGap = gap;
                gapPosition = sortedTrees[i].position + gap / 2;
            }
        }
        
        linearTrees.push({ id: nextLinearTreeId++, position: gapPosition });
        renderLinearTrees();
        updateLinearStats();
    }
}

// 删除线性树
function removeLinearTree(id) {
    // 不能删除起点和终点
    if (id === 1 || id === 2) return;
    
    linearTrees = linearTrees.filter(tree => tree.id !== id);
    
    if (equalSpacing && linearTrees.length > 2) {
        redistributeLinearTrees();
    } else {
        renderLinearTrees();
        updateLinearStats();
    }
    
    if (selectedLinearTree === id) {
        selectedLinearTree = null;
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
    // 不能拖拽起点和终点，或者在等距离模式下
    if (id === 1 || id === 2 || equalSpacing) return;
    
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
    renderLinearTrees();
    console.log('Toggled linear distances:', showLinearDistances);
}

// 更新线性植树统计
function updateLinearStats() {
    const treeCount = linearTrees.length;
    const intervalCount = Math.max(1, treeCount - 1); // 确保至少有一个间隔
    const avgDistance = Math.round((totalDistance / intervalCount) * 10) / 10;
    
    linearTreeCount.textContent = `${treeCount}棵`;
    linearIntervalCount.textContent = `${intervalCount}个`;
    linearAvgDistance.textContent = `${avgDistance}米`;
    
    // 更新公式
    linearFormula1.textContent = `${intervalCount} + 1 = ${intervalCount + 1}`;
    linearFormula2.textContent = `${treeCount} - 1 = ${treeCount - 1}`;
    linearFormula3.textContent = `${totalDistance} ÷ ${intervalCount} = ${avgDistance}`;
    
    // 直接更新平均间隔距离的显示
    document.getElementById('linear-avg-distance').textContent = `${avgDistance}米`;
    
    console.log('Updated linear stats:', { totalDistance, treeCount, intervalCount, avgDistance });
}
