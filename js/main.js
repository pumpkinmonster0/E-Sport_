// Ensure DOM has fully load --> Ensure document.getElementById can find all element
document.addEventListener('DOMContentLoaded', () => {

    ///////////////////A AND Y BUTTON///////////////////////////////////
    // Get screen content element --> Find element in shell.js (ensure all button element can use)
    const screenContent = document.getElementById('screenContent');

    if (!screenContent) {
        console.error('CAN\'T FIND Element(screenContent)');
        return;
    }
    console.log('Element on screenContent found');

    // Scroll configuration --> Ensure scroll distance per click
    const clickScrollAmount = 300;

    // Scroll function
    function clickScroll(direction) {
        if (direction === 'down') {
            screenContent.scrollBy({ top: clickScrollAmount, behavior: 'smooth' });
            console.log(`Scroll down by ${clickScrollAmount}px`); // once press, it will show in console
        } else if (direction === 'up') {
            screenContent.scrollBy({ top: -clickScrollAmount, behavior: 'smooth' });
            console.log(`Scroll up by ${clickScrollAmount}px`);
        }

        setTimeout(() => {
            document.dispatchEvent(new Event('scrollReveal'));
        }, 500);
    }

    // Key handling --> from keyboard listener
    function handleKeyPress(key) {
        let button = null;
        if (key === 'y' || key === 'up') {
            button = document.querySelector('.btn-y');
        } else if (key === 'a' || key === 'down') {
            button = document.querySelector('.btn-a');
        }

        if (button) {
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), 150);
        }

        switch (key) {
            case 'a':
            case 'down':
                clickScroll('down');
                break;
            case 'y':
            case 'up':
                clickScroll('up');
                break;
            default:
                break;
        }
    }

    // Keyboard event listener --> Monitor keyboard action and pass to key handle
    document.addEventListener('keydown', (e) => {
        // prevent from if enter "a" or "y" in a text box
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) {
            return;
        }
        const keyMap = {
            'a': 'a',
            'A': 'a',
            'y': 'y',
            'Y': 'y',
            'ArrowUp': 'up',
            'ArrowDown': 'down'
        };
        const key = keyMap[e.key];
        if (key) {
            e.preventDefault();
            handleKeyPress(key);
        }
    });

    // Button click listener
    const btnY = document.querySelector('.btn-y');
    const btnA = document.querySelector('.btn-a');

    function setupButton(button, key) {
        if (!button) return;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            handleKeyPress(key);
        });

        // console feedback
        console.log(`${key.toUpperCase()} button has prepared`);
    }

    // SETUP + MSG AFTER FULLY LOAD
    setupButton(btnY, 'y');
    setupButton(btnA, 'a');
    console.log('E-SPORT CLUB FULLY LOADED');
    console.log('ALL BUTTON AND KEYBOARD LISTENER FOR SCROLL READY');

    ///////////////////////TOP BUTTON/////////////////////////
    // Return Top
    function scrollToTop() {
        const screenContent = document.getElementById('screenContent');
        if (!screenContent) return;

        screenContent.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('Top button has pressed'); // once press, it will show in console
    }

    // Prepare the button
    const btnTop = document.getElementById('btnTop');
    if (btnTop) {
        btnTop.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToTop();

            // press feedback
            btnTop.classList.add('active');
            setTimeout(() => btnTop.classList.remove('active'), 150);
        });
        console.log('Top button ready');
    }

    ////////////////////////X AND B BUTTON////////////////////////////////
    const audioX = new Audio('images/music/Legends Never Die (ft. Against The Current)  Worlds 2017 - League of Legends.mp3');
    const audioB = new Audio('images/music/Plants vs. Zombies (Main Theme).mp3');

    // loop loop loop
    audioX.loop = true;
    audioB.loop = true;

    const tracks = { x: audioX, b: audioB };
    const MUSIC_STORAGE_KEY = 'musicPlayerState';

    // Safari (incl. iOS Safari) detection --> only Safari needs a tap-to-resume prompt
    function isSafari() {
        const ua = navigator.userAgent;
        return /^((?!chrome|android|crios|fxios|edg).)*safari/i.test(ua);
    }


    function saveMusicState(track, playing) {
        const audio = track ? tracks[track] : null;
        const state = {
            track: track,
            playing: playing,
            time: audio ? audio.currentTime : 0
        };
        sessionStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(state));
    }

    function loadMusicState() {
        const raw = sessionStorage.getItem(MUSIC_STORAGE_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    // Small unobtrusive "tap to resume" banner --> only ever shown on Safari,
    // and only when a page-load autoplay attempt actually got blocked.
    function showResumeMusicPrompt(trackKey) {
        if (document.getElementById('musicResumePrompt')) return; // already showing

        const prompt = document.createElement('div');
        prompt.id = 'musicResumePrompt';
        prompt.textContent = '🔇 Tap to resume music';
        prompt.style.cssText = [
            'position:fixed',
            'top:16px',
            'left:50%',
            'transform:translateX(-50%)',
            'z-index:9999',
            'background:#111',
            'color:#fff',
            'padding:10px 16px',
            'border-radius:8px',
            'cursor:pointer',
            'font-size:14px',
            'font-family:sans-serif',
            'box-shadow:0 2px 10px rgba(0,0,0,0.4)'
        ].join(';');

        prompt.addEventListener('click', () => {
            const audio = tracks[trackKey];
            audio.play()
                .then(() => {
                    saveMusicState(trackKey, true);
                    console.log(`${trackKey.toUpperCase()} resumed after tap`);
                })
                .catch(err => console.error('Resume after tap error:', err));
            prompt.remove();
        }, { once: true });

        document.body.appendChild(prompt);
    }

    // stop and continue
    function toggleTrack(key) {
        const audio = tracks[key];
        const state = loadMusicState();
        const isCurrentlyPlaying = state && state.track === key && state.playing;

        //youtube video
        musicPausedByYT = null;

        if (isCurrentlyPlaying) {
            audio.pause();
            saveMusicState(key, false);
            console.log(`${key.toUpperCase()} paused`);
        } else {
            const otherKey = key === 'x' ? 'b' : 'x';
            tracks[otherKey].pause();

            audio.play().catch(err => console.error('Play error:', err));
            saveMusicState(key, true);
            console.log(`${key.toUpperCase()} playing`);
        }
    }

    //  X button - ticket
    const btnX = document.querySelector('.btn-x');
    if (btnX) {
        btnX.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTrack('x');

            btnX.classList.add('active');
            setTimeout(() => btnX.classList.remove('active'), 150);
        });
        console.log('X button music ready');
    }

    // B button - zombie
    const btnB = document.querySelector('.btn-b');
    if (btnB) {
        btnB.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTrack('b');


            btnB.classList.add('active');
            setTimeout(() => btnB.classList.remove('active'), 150);
        });
        console.log('B button music ready');//ensure it work successfully
    }

    // store in local
    setInterval(() => {
        const state = loadMusicState();
        if (state && state.playing && state.track) {
            saveMusicState(state.track, true);
        }
    }, 1000);

    // continue if before next html it is playing
    (function resumeMusicOnLoad() {
        const state = loadMusicState();
        if (!state || !state.track || !state.playing) return;

        const audio = tracks[state.track];
        audio.currentTime = state.time || 0;

        const playPromise = audio.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise
                .then(() => {
                    console.log(`Resuming ${state.track.toUpperCase()} at ${Math.floor(state.time)}s`);
                })
                .catch(err => {
                    console.warn('Autoplay blocked on page load:', err);
                    // keep the saved "playing:true" state as-is so the tap-to-resume
                    // button knows what to resume; only Safari gets bothered with a prompt.
                    if (isSafari()) {
                        showResumeMusicPrompt(state.track);
                    }
                });
        }
    })();

    console.log('MUSIC PLAYER FULLY LOADED (persists across page navigation)');


let ytPlayingCount = 0;
let musicPausedByYT = null;
const ytPlayers = {}; // iframe.id -> YT.Player instance

function loadYouTubeAPI() {
    const iframes = document.querySelectorAll('iframe.yt-embed');
    if (iframes.length === 0) {
        console.log('No YouTube iframe (.yt-embed) found, skip YouTube integration');
        return;
    }

    if (window.YT && window.YT.Player) {
        initYouTubePlayers();
        return;
    }
    if (document.getElementById('youtube-iframe-api')) return;

    const tag = document.createElement('script');
    tag.id = 'youtube-iframe-api';
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = initYouTubePlayers;
}

function initYouTubePlayers() {
    const iframes = document.querySelectorAll('iframe.yt-embed');
    iframes.forEach((iframe, index) => {
        if (!iframe.id) {
            iframe.id = `yt-embed-${index}-${Date.now()}`;
        }

        if (iframe.src && iframe.src.indexOf('enablejsapi=1') === -1) {
            const sep = iframe.src.indexOf('?') === -1 ? '?' : '&';
            iframe.src = iframe.src + sep + 'enablejsapi=1';
        }

        const player = new YT.Player(iframe.id, {
            events: {
                onStateChange: onYouTubeStateChange
            }
        });
        ytPlayers[iframe.id] = player;
    });
    console.log(`YouTube <-> music integration ready (${iframes.length} video(s))`);
}

window.setYouTubeVideo = function (iframeId, videoId) {
    const iframe = document.getElementById(iframeId);
    if (!iframe) return;

    const player = ytPlayers[iframeId];
    if (player && typeof player.cueVideoById === 'function') {
        player.cueVideoById(videoId);
    } else if (player && typeof player.loadVideoById === 'function') {
        player.loadVideoById(videoId);
    } else {
        iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    }
};

    function onYouTubeStateChange(event) {

        if (event.data === YT.PlayerState.PLAYING) {
            ytPlayingCount++;
            pauseMusicForYouTube();
        } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
            ytPlayingCount = Math.max(0, ytPlayingCount - 1);
            if (ytPlayingCount === 0) {
                resumeMusicAfterYouTube();
            }
        }
    }

    function pauseMusicForYouTube() {
        const state = loadMusicState();
        if (state && state.playing && state.track) {
            tracks[state.track].pause();
            musicPausedByYT = state.track;
            saveMusicState(state.track, false);
            console.log(`YouTube playing -> auto-paused ${state.track.toUpperCase()} music`);
        }
    }

    function resumeMusicAfterYouTube() {
        if (musicPausedByYT) {
            const key = musicPausedByYT;
            musicPausedByYT = null;
            tracks[key].play().catch(err => console.error('Resume after YouTube error:', err));
            saveMusicState(key, true);
            console.log(`YouTube stopped -> auto-resumed ${key.toUpperCase()} music`);
        }
    }

    loadYouTubeAPI();
});