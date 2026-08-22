// cookie consent banner + google analytics

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

function getCookie(name) {
    let cname = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
    }
    return "";
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

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
