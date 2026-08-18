document.addEventListener('DOMContentLoaded', () => {

    const screenArea = document.querySelector('.screen-area');

    if (!screenArea) {
        console.warn('neon-lines.js: cant find .screen-area, shell.js may not executed yet');
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


    screenArea.insertBefore(dynamicLines, screenArea.firstChild);

    console.log('Neon filter has prepared');
});