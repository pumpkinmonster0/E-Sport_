/* read the match start time from data-start then time to .countdown-timer to do process 
then when time reach, connect to link end also connect to link*/ 

(function () {
    'use strict';

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    function buildIframe(videoId) {
        var iframe = document.createElement('iframe');
        iframe.className = 'match-iframe';
        iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=0&rel=0';
        iframe.title = 'Live match stream';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allowFullscreen = true;
        return iframe;
    }

    function buildFallbackLink(videoId) {
        var link = document.createElement('a');
        link.className = 'watch-on-youtube';
        link.href = 'https://www.youtube.com/watch?v=' + videoId;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Can\'t see the video? Watch on YouTube';
        return link;
    }

    function goEnded(card, media, videoId) {
        // when match over, display the daufalt image

        if (card._originalMediaHTML) {
            media.innerHTML = card._originalMediaHTML;
        }

        var overlayLabel = media.querySelector('.countdown-label');
        var overlayTimer = media.querySelector('.countdown-timer');
        if (overlayLabel) overlayLabel.textContent = 'ENDED';
        if (overlayTimer) overlayTimer.textContent = 'WATCH REPLAY';

        // make the whole media box clickable through to the replay
        if (!media.querySelector('a.match-thumb-link')) {
            var link = document.createElement('a');
            link.className = 'match-thumb-link';
            link.href = 'https://www.youtube.com/watch?v=' + videoId;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.style.position = 'absolute';
            link.style.inset = '0';
            link.style.zIndex = '2';
            media.style.position = media.style.position || 'relative';
            media.appendChild(link);
        }

        var statusBadge = card.querySelector('.status-badge');
        var statusText = card.querySelector('.status-text');
        if (statusBadge) {
            statusBadge.textContent = 'ENDED';
            statusBadge.classList.remove('yellow', 'green', 'pulse');
            statusBadge.classList.add('gray');
        }
        if (statusText) statusText.textContent = 'WATCH REPLAY';
    }

    function goLive(card, media, videoId) {
        // avoid rebuilding the iframe if this card is already live
        if (media.querySelector('iframe')) return;

        media.innerHTML = '';
        media.appendChild(buildIframe(videoId));
        // fallback link so the match is still reachable even if the
        // embed itself ever fails
        media.appendChild(buildFallbackLink(videoId));

        var statusBadge = card.querySelector('.status-badge');
        var statusText = card.querySelector('.status-text');
        if (statusBadge) {
            statusBadge.textContent = 'LIVE';
            statusBadge.classList.remove('yellow');
            statusBadge.classList.add('green', 'pulse');
        }
        if (statusText) statusText.textContent = 'WATCH NOW';
    }

    function tick(card) {
        var startTime = new Date(card.dataset.start).getTime();
 
        var endTime = card.dataset.end ? new Date(card.dataset.end).getTime() : NaN;
        var videoId = card.dataset.videoId;
        var media = card.querySelector('.match-media');
        var timerEl = card.querySelector('.countdown-timer');
        var statusBadge = card.querySelector('.status-badge');
        var statusText = card.querySelector('.status-text');

        if (isNaN(startTime) || !videoId || !media) return;

        var diff = startTime - Date.now();

        // match has ended 
        if (!isNaN(endTime) && Date.now() >= endTime) {
            goEnded(card, media, videoId);
            if (card._timerId) {
                clearInterval(card._timerId);
                card._timerId = null;
            }
            return;
        }

        if (diff <= 0) {
            goLive(card, media, videoId);
            if (card._timerId) {
                clearInterval(card._timerId);
                card._timerId = null;
            }
            return;
        }

        var totalSeconds = Math.floor(diff / 1000);
        var days = Math.floor(totalSeconds / 86400);
        var hours = Math.floor((totalSeconds % 86400) / 3600);
        var minutes = Math.floor((totalSeconds % 3600) / 60);
        var seconds = totalSeconds % 60;

        if (timerEl) {
            timerEl.textContent = pad(days) + ':' + pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
        }
        if (statusBadge) {
            statusBadge.textContent = 'UPCOMING';
            statusBadge.classList.remove('green', 'pulse');
            statusBadge.classList.add('yellow');
        }
        if (statusText) statusText.textContent = 'Starts in ' + days + 'd ' + hours + 'h';
    }

    function initCard(card) {
        var media = card.querySelector('.match-media');
        if (media) card._originalMediaHTML = media.innerHTML;

        tick(card); // run once so there's no flash of "LOADING"
        card._timerId = setInterval(function () {
            tick(card);
        }, 1000);
    }

    document.addEventListener('DOMContentLoaded', function () {
        var cards = document.querySelectorAll('.live-match-card');
        cards.forEach(initCard);
    });
})();