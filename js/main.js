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

    ///////////////////////X AND B MUSIC PLAYER (跨頁面持續播放)/////////////////////////
    // 原理：<audio> 元素在切換 html 頁面時一定會被銷毀、音樂會斷。
    // 解法：把「目前播哪首、播到第幾秒」存進 localStorage，
    // 新頁面一載入就自動讀出來、接著同一首歌的進度繼續播，
    // 讓使用者感覺音樂沒有中斷。
    // 注意：main.js（連同 shell.js）必須被每一個 html 頁面引入，
    // 而且兩首歌的路徑在每個頁面都要正確，這個機制才會生效。

    // 建立 audio 元素（請將路徑替換成你實際的 mp3 檔案位置）
    const audioX = new Audio('images/music/Legends Never Die (ft. Against The Current)  Worlds 2017 - League of Legends.mp3');
    const audioB = new Audio('images/music/Plants vs. Zombies (Main Theme).mp3');

    // 播完自動從頭重播，一直 loop 直到使用者按暫停
    audioX.loop = true;
    audioB.loop = true;

    const tracks = { x: audioX, b: audioB };
    const MUSIC_STORAGE_KEY = 'musicPlayerState'; // { track: 'x'|'b'|null, playing: bool, time: number }

    function saveMusicState(track, playing) {
        const audio = track ? tracks[track] : null;
        const state = {
            track: track,
            playing: playing,
            time: audio ? audio.currentTime : 0
        };
        localStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(state));
    }

    function loadMusicState() {
        const raw = localStorage.getItem(MUSIC_STORAGE_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    // 按一下播放，再按一下暫停，再按一下又播放...（無限循環）
    function toggleTrack(key) {
        const audio = tracks[key];
        const state = loadMusicState();
        const isCurrentlyPlaying = state && state.track === key && state.playing;

        // 使用者手動按按鈕 = 使用者的意思優先，不要讓 YouTube 自動恢復邏輯之後蓋掉這個動作
        musicPausedByYT = null;

        if (isCurrentlyPlaying) {
            // 目前正在播 -> 按一下變暫停
            audio.pause();
            saveMusicState(key, false);
            console.log(`${key.toUpperCase()} paused`);
        } else {
            // 目前沒在播（或播的是另一首）-> 先停掉另一首，再播這首
            const otherKey = key === 'x' ? 'b' : 'x';
            tracks[otherKey].pause();

            audio.play().catch(err => console.error('Play error:', err));
            saveMusicState(key, true);
            console.log(`${key.toUpperCase()} playing`);
        }
    }

    // 綁定 X 按鈕
    const btnX = document.querySelector('.btn-x');
    if (btnX) {
        btnX.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTrack('x');

            // 按鍵回饋
            btnX.classList.add('active');
            setTimeout(() => btnX.classList.remove('active'), 150);
        });
        console.log('X button music ready');
    }

    // 綁定 B 按鈕
    const btnB = document.querySelector('.btn-b');
    if (btnB) {
        btnB.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTrack('b');

            // 按鍵回饋
            btnB.classList.add('active');
            setTimeout(() => btnB.classList.remove('active'), 150);
        });
        console.log('B button music ready');
    }

    // 每秒把播放進度寫回 localStorage，讓跳轉頁面後能接著同一秒繼續播
    setInterval(() => {
        const state = loadMusicState();
        if (state && state.playing && state.track) {
            saveMusicState(state.track, true);
        }
    }, 1000);

    // 頁面一載入：如果之前有歌正在播，接續播放（同一首、同一個進度）
    (function resumeMusicOnLoad() {
        const state = loadMusicState();
        if (state && state.track && state.playing) {
            const audio = tracks[state.track];
            audio.currentTime = state.time || 0;
            audio.play().catch(err => console.error('Resume play error:', err));
            console.log(`Resuming ${state.track.toUpperCase()} at ${Math.floor(state.time)}s`);
        }
    })();

    console.log('MUSIC PLAYER FULLY LOADED (persists across page navigation)');

    ///////////////////////YOUTUBE 影片 <-> 背景音樂 連動/////////////////////////
    // 規則：頁面上只要有任一支 YouTube 影片正在播放，就自動暫停背景音樂；
    // 等所有 YouTube 影片都停止播放（暫停/播完）時，如果音樂是被 YouTube 自動停掉的，
    // 就自動接回去繼續播（使用者手動按按鈕暫停的不會被自動恢復）。
    //
    // 使用方式：把要監控的 YouTube <iframe> 加上 class="yt-embed"：
    // <iframe class="yt-embed" src="https://www.youtube.com/embed/VIDEO_ID" ...></iframe>
    // 不需要手動加 enablejsapi=1，下面的程式會自動幫你補上。

    let ytPlayingCount = 0;
    let musicPausedByYT = null; // 記錄被 YouTube 自動停掉之前，正在播的是哪首 ('x' | 'b' | null)

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
        if (document.getElementById('youtube-iframe-api')) return; // 已經在載入中

        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);

        window.onYouTubeIframeAPIReady = initYouTubePlayers;
    }

    function initYouTubePlayers() {
        const iframes = document.querySelectorAll('iframe.yt-embed');
        iframes.forEach((iframe, index) => {
            // 確保 iframe 有 id，YT.Player 需要用 id 綁定
            if (!iframe.id) {
                iframe.id = `yt-embed-${index}-${Date.now()}`;
            }
            // 確保 src 有 enablejsapi=1，不然收不到播放狀態事件
            if (iframe.src.indexOf('enablejsapi=1') === -1) {
                const sep = iframe.src.indexOf('?') === -1 ? '?' : '&';
                iframe.src = iframe.src + sep + 'enablejsapi=1';
            }

            new YT.Player(iframe.id, {
                events: {
                    onStateChange: onYouTubeStateChange
                }
            });
        });
        console.log(`YouTube <-> music integration ready (${iframes.length} video(s))`);
    }

    function onYouTubeStateChange(event) {
        // YT.PlayerState.PLAYING === 1, PAUSED === 2, ENDED === 0
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