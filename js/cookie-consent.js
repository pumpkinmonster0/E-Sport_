// cookie consent banner + google analytics

$(document).ready(function () {

    const CONSENT_COOKIE = 'cookie_consent'; // 'accepted' | 'rejected'
    const GA_MEASUREMENT_ID = 'G-4YRRCX6V0L'; // Measurement ID

    // Check existing consent on page load
    const existingConsent = getCookie(CONSENT_COOKIE);

    if (!existingConsent) {
        //show the banner
        $('#cookie-consent-banner').fadeIn();
    } else if (existingConsent === 'accepted') {
        // Already accepted before -> load GA silently
        loadGoogleAnalytics();
    }

    //Accept
    $('#cookie-accept-btn').click(function () {
        setCookie(CONSENT_COOKIE, 'accepted', 365);
        $('#cookie-consent-banner').fadeOut();
        loadGoogleAnalytics();
    });

    //reject
    $('#cookie-reject-btn').click(function () {
        setCookie(CONSENT_COOKIE, 'rejected', 365);
        $('#cookie-consent-banner').fadeOut();
        // the essential cookies work as normal ya.
    });

    //loading google analytics (gtag.js) 
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