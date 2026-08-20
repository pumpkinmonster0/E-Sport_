document.addEventListener('DOMContentLoaded', () => {

    const originalChildren = Array.from(document.body.childNodes);

    // Left Screen Area
    const screenArea = document.createElement('div');
    screenArea.className = 'screen-area';

    const screenContent = document.createElement('div');
    screenContent.className = 'screen-content';
    screenContent.id = 'screenContent';

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