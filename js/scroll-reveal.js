///////////////Scroll-reveal function//////////
document.addEventListener('DOMContentLoaded', () => {


    //get all element
    const pageContent = document.getElementById('pageContent');

    if (!pageContent) {
        console.warn('Cant find pageContent');
        return;
    }

    // choose element
    const elements = pageContent.querySelectorAll('h1, h2, h3,h4, p, .content-row, .footer, div[style*="background"]');

    const revealElements = Array.from(elements).filter(el => {
        return el.textContent.trim().length > 0;
    });

    console.log(`auto choose ${revealElements.length} element`);

    //Content is hidden at first (transparent + moved down)
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
        el.dataset.revealed = 'false';
    });

    //Content enters the visible area
    function revealElement(el) {
        if (el.dataset.revealed === 'true') return;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.dataset.revealed = 'true';
    }

    // Check which elements are visible and reveal them
    function checkAndReveal() {
        const screenContent = document.getElementById('screenContent');
        if (!screenContent) return;

        const scrollTop = screenContent.scrollTop;
        const clientHeight = screenContent.clientHeight;

        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const containerRect = screenContent.getBoundingClientRect();


            const elTop = rect.top - containerRect.top;
            const elBottom = rect.bottom - containerRect.top;


            if (elBottom > 0 && elTop < clientHeight) {
                revealElement(el);
            }
        });
    }

    //Detect the action call from main.js(button keyboard mouse)
    const screenContent = document.getElementById('screenContent');
    if (screenContent) {
        screenContent.addEventListener('scroll', checkAndReveal);

        // end - ensure all have display
        screenContent.addEventListener('scrollend', checkAndReveal);
    }

    //Detect the action call from main.js
    document.addEventListener('scrollReveal', checkAndReveal);


    // ensure finish
    setTimeout(checkAndReveal, 100);
    // ensure all element load
    setTimeout(checkAndReveal, 500);

    console.log('Scroll reveal function ready');
});