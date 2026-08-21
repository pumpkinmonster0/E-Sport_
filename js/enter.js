// enter.js — runs after shell.js (builds .screen-area + controller)
// and neon.js (adds the scanline/beam overlay). Everything this file
// creates is appended inside .screen-area, so it stays inside the
// switch-container shell. Music (X/B) is intentionally handled by
// main.js, not here — see the note further down.
document.addEventListener('DOMContentLoaded', () => {

    const screenArea = document.querySelector('.screen-area');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');

    if (!screenArea || !step1 || !step2) {
        console.warn('enter.js: required elements not found, is shell.js loaded first?');
        return;
    }

    let step = 0; // 0 = step1 showing, 1 = step2 showing
    let locked = false;

    function showStep(n) {
        step1.classList.toggle('step-active', n === 0);
        step2.classList.toggle('step-active', n === 1);
    }
    showStep(0);

    /* ---------------------------------------------------------
       Build the FX layer (spotlight + falling particles + flash),
       confined entirely inside .screen-area.
    --------------------------------------------------------- */
    const fx = document.createElement('div');
    fx.className = 'enter-fx';
    fx.innerHTML = `
        <div class="spotlight-cone"></div>
        <div class="spotlight-floor"></div>
        <canvas class="enter-particles"></canvas>
        <div class="flash-overlay"></div>
    `;
    screenArea.appendChild(fx);

    const flashOverlay = fx.querySelector('.flash-overlay');
    const canvas = fx.querySelector('.enter-particles');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        const rect = screenArea.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let particles = [];
    function createParticles(count) {
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.6 + 0.4,
                speedY: Math.random() * 0.3 + 0.1,
                drift: Math.random() * 0.4 - 0.2,
                alpha: Math.random() * 0.5 + 0.15,
                flicker: Math.random() * 0.015 + 0.003
            });
        }
    }
    createParticles(70);

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.drift;
            p.alpha += (Math.random() - 0.5) * p.flicker;
            p.alpha = Math.max(0.05, Math.min(0.7, p.alpha));

            if (p.y > canvas.height + 4) {
                p.y = -4;
                p.x = Math.random() * canvas.width;
            }
            if (p.x > canvas.width + 4) p.x = -4;
            if (p.x < -4) p.x = canvas.width + 4;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(190, 225, 255, ${p.alpha})`;
            ctx.shadowColor = 'rgba(130, 200, 255, 0.9)';
            ctx.shadowBlur = 4;
            ctx.fill();
        });
        requestAnimationFrame(drawParticles);
    }
    drawParticles();

    /* ---------------------------------------------------------
       NOTE: X (🎫) / B (🧟) music toggle is intentionally NOT
       handled here anymore. main.js already owns that (its own
       audioX/audioB instances + toggleTrack() + the
       'musicPlayerState' localStorage key), and it's now loaded
       on this page too. Duplicating that logic here caused two
       separate Audio objects to fight over the same buttons —
       one would always force-play, the other would pause a
       *different* instance — so playback never actually stopped.
       Let main.js's click listener on .btn-x/.btn-b be the only
       one; nothing to wire up on this page for that.
    --------------------------------------------------------- */

    /* ---------------------------------------------------------
       Step navigation
    --------------------------------------------------------- */
    function goForward() {
        if (locked) return;
        if (step === 0) {
            step = 1;
            showStep(1);
        } else if (step === 1) {
            leaveToIndex();
        }
    }

    function goBack() {
        if (locked) return;
        if (step === 1) {
            step = 0;
            showStep(0);
        }
    }

    function leaveToIndex() {
        if (locked) return;
        locked = true;
        flashOverlay.classList.add('flash-active');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 850);
    }

    /* ---------------------------------------------------------
       Wire the REAL controller buttons built by shell.js.
       Y and A are also bound by main.js (for its generic
       scrollBy behaviour) — that's harmless here since this
       page's screen-content has overflow:hidden, so main.js's
       scroll call is a no-op and our own step logic below still
       runs. Only .btn-ok is exclusively ours (main.js never
       touches it), and X/B are exclusively main.js's now.
    --------------------------------------------------------- */
    const btnY = document.querySelector('.btn-y');
    const btnA = document.querySelector('.btn-a');
    const btnOk = document.querySelector('.btn-ok');

    function pressFeedback(btn) {
        if (!btn) return;
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 150);
    }

    if (btnA) btnA.addEventListener('click', (e) => { e.preventDefault(); pressFeedback(btnA); goForward(); });
    if (btnY) btnY.addEventListener('click', (e) => { e.preventDefault(); pressFeedback(btnY); goBack(); });
    if (btnOk) btnOk.addEventListener('click', (e) => { e.preventDefault(); pressFeedback(btnOk); goForward(); });

    /* ---------------------------------------------------------
       Keyboard — same key mapping used elsewhere on the site
    --------------------------------------------------------- */
    document.addEventListener('keydown', (e) => {
        if (locked) return;
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

        switch (e.key) {
            case 'a':
            case 'A':
            case 'ArrowDown':
                e.preventDefault();
                pressFeedback(btnA);
                goForward();
                break;
            case 'y':
            case 'Y':
            case 'ArrowUp':
                e.preventDefault();
                pressFeedback(btnY);
                goBack();
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                pressFeedback(btnOk);
                goForward();
                break;
            default:
                break;
        }
    });

    /* ---------------------------------------------------------
       Mouse wheel / touch swipe on the screen itself
    --------------------------------------------------------- */
    let wheelCooldown = false;
    screenArea.addEventListener('wheel', (e) => {
        if (wheelCooldown || locked) return;
        wheelCooldown = true;
        setTimeout(() => { wheelCooldown = false; }, 700);
        if (e.deltaY > 0) goForward();
        else if (e.deltaY < 0) goBack();
    }, { passive: true });

    let touchStartY = null;
    screenArea.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    screenArea.addEventListener('touchend', (e) => {
        if (touchStartY === null || locked) return;
        const diff = touchStartY - e.changedTouches[0].clientY;
        touchStartY = null;
        if (diff > 40) goForward();
        else if (diff < -40) goBack();
    }, { passive: true });

    console.log('Enter screen ready (using shell controller buttons)');
});