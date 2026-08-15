// ============================================================
//  滾動觸發動畫 (Scroll Reveal) - 自動版
//  支援：滾動觸發 + 按鈕點擊觸發
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    //  1. 獲取所有要動畫的元素
    // ============================================================
    const pageContent = document.getElementById('pageContent');
    
    if (!pageContent) {
        console.warn('找不到 #pageContent，無法啟用 Scroll Reveal');
        return;
    }

    // 選取所有內容元素
    const elements = pageContent.querySelectorAll('h1, h2, h3, p, .content-row, .footer, div[style*="background"]');
    
    const revealElements = Array.from(elements).filter(el => {
        return el.textContent.trim().length > 0;
    });

    console.log(`✅ 自動選取 ${revealElements.length} 個元素進行動畫`);

    // ============================================================
    //  2. 設定初始狀態（隱藏）
    // ============================================================
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
        el.dataset.revealed = 'false';  // 標記尚未顯示
    });

    // ============================================================
    //  3. 顯示元素的函數（共用）
    // ============================================================
    function revealElement(el) {
        if (el.dataset.revealed === 'true') return;  // 已經顯示過了
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.dataset.revealed = 'true';
    }

    // ============================================================
    //  4. 檢查並顯示所有應該出現的元素
    // ============================================================
    function checkAndReveal() {
        const screenContent = document.getElementById('screenContent');
        if (!screenContent) return;

        const scrollTop = screenContent.scrollTop;
        const clientHeight = screenContent.clientHeight;

        revealElements.forEach(el => {
            // 計算元素在 screenContent 中的位置
            const rect = el.getBoundingClientRect();
            const containerRect = screenContent.getBoundingClientRect();
            
            // 計算元素相對於螢幕容器的位置
            const elTop = rect.top - containerRect.top;
            const elBottom = rect.bottom - containerRect.top;

            // 如果元素任何部分在可視區域內，就顯示
            if (elBottom > 0 && elTop < clientHeight) {
                revealElement(el);
            }
        });
    }

    // ============================================================
    //  5. 監聽滾動事件（滑鼠滾輪 + 鍵盤 Y/A）
    // ============================================================
    const screenContent = document.getElementById('screenContent');
    if (screenContent) {
        // 監聽滾動事件
        screenContent.addEventListener('scroll', checkAndReveal);
        
        // 監聽滾動結束（確保所有元素都出現）
        screenContent.addEventListener('scrollend', checkAndReveal);
    }

    // ============================================================
    //  6. 監聽 main.js 的滾動完成事件（自訂事件）
    // ============================================================
    document.addEventListener('scrollReveal', checkAndReveal);

    // ============================================================
    //  7. 初次載入時檢查（顯示已經在畫面上的元素）
    // ============================================================
    // 延遲一下，確保畫面渲染完成
    setTimeout(checkAndReveal, 100);
    // 再延遲一次，確保所有內容都載入
    setTimeout(checkAndReveal, 500);

    console.log('🎯 Scroll Reveal 已啟動（支援滑鼠滾動 + 按鈕點擊）');
});