// cookie consent banner + google analytics

$(document).ready(function () {

    const CONSENT_COOKIE = 'cookie_consent'; // 'accepted' | 'rejected'
    const GA_MEASUREMENT_ID = 'G-4YRRCX6V0L'; // Measurement ID

    // ---- Check existing consent on page load ----
    const existingConsent = getCookie(CONSENT_COOKIE);

    if (!existingConsent) {
        // No decision yet -> show the banner
        $('#cookie-consent-banner').fadeIn();
    } else if (existingConsent === 'accepted') {
        // Already accepted before -> load GA silently
        loadGoogleAnalytics();
    }
    // if 'rejected' -> do nothing, only essential (login) cookies work

    // ---- Accept button ----
    $('#cookie-accept-btn').click(function () {
        setCookie(CONSENT_COOKIE, 'accepted', 365);
        $('#cookie-consent-banner').fadeOut();
        loadGoogleAnalytics();
    });

    // ---- Reject button ----
    $('#cookie-reject-btn').click(function () {
        setCookie(CONSENT_COOKIE, 'rejected', 365);
        $('#cookie-consent-banner').fadeOut();
        // Google Analytics will NOT load.
        // Essential cookies (e.g. logged_in_user) still work as normal.
    });

    // ---- Loads Google Analytics (gtag.js) dynamically ----
    function loadGoogleAnalytics() {
        if (window.gaLoaded) return; // avoid loading twice
        window.gaLoaded = true;

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        window.gtag = gtag;

        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID);

        console.log('Google Analytics loaded after user consent.');
    }

});