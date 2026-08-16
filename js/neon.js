// ============================================================
// 霓虹光柱 / 掃描線效果 —— 獨立腳本，不需修改 shell.js
// 必須放在 <script src="js/shell.js"> 之後載入，
// 這樣 shell.js 先把 .screen-area 建出來，這支腳本再把
// 霓虹燈的 DOM 插進去（放在 .screen-content 外面，
// 所以捲動內容時霓虹燈不會被捲走，會固定蓋在整個螢幕上）。
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

    const screenArea = document.querySelector('.screen-area');

    if (!screenArea) {
        console.warn('neon-lines.js: 找不到 .screen-area，可能 shell.js 還沒執行');
        return;
    }

    const dynamicLines = document.createElement('div');
    dynamicLines.className = 'dynamic-lines';
    dynamicLines.innerHTML = `
        <div class="scanline"></div>
        <div class="scanline-2"></div>
        <div class="scanline-3"></div>
        <div class="neon-beam"></div>
        <div class="neon-beam-2"></div>
        <div class="neon-beam-3"></div>
    `;

    // 插在最前面，當作 .screen-content 的兄弟節點（同層、不同 div）
    screenArea.insertBefore(dynamicLines, screenArea.firstChild);

    console.log('✨ 霓虹燈效果已插入');
});