document.addEventListener('DOMContentLoaded', () => {

    // 抓「真实节点」而不是文字，这样节点上已绑定的事件监听器不会遗失
    const originalChildren = Array.from(document.body.childNodes);

    // Left Screen Area
    const screenArea = document.createElement('div');
    screenArea.className = 'screen-area';

    const screenContent = document.createElement('div');
    screenContent.className = 'screen-content';
    screenContent.id = 'screenContent';

    // 把原本 body 底下的节点「搬」进 screenContent，而不是重新生成
    originalChildren.forEach(node => screenContent.appendChild(node));

    screenArea.appendChild(screenContent);

    // Right Controller Area
    const controllerArea = document.createElement('div');
    controllerArea.className = 'controller-area';
    controllerArea.innerHTML = `
                <!-- Button Group (YABX) -->
                <div class="diamond-group">
                    <button class="btn btn-y">Y</button>
                    <button class="btn btn-x">🎫</button>
                    <button class="btn btn-b">🧟</button>
                    <button class="btn btn-a">A</button>
                </div>

                <!-- OK Button -->
                <button class="btn-ok">OK</button>

                <!-- TOP BUTTON -->
                <button class="btn-top" id="btnTop">Top</button>
    `;

    // switch-container
    const switchContainer = document.createElement('div');
    switchContainer.className = 'switch-container';
    switchContainer.appendChild(screenArea);
    switchContainer.appendChild(controllerArea);

    // Inject the layout into body
    document.body.appendChild(switchContainer);
});