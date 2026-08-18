document.addEventListener('DOMContentLoaded', function () {

    // wait for the package of pagecontent
    const waitForPage = setInterval(function () {
        const pageContent = document.getElementById('pageContent');

        if (pageContent) {
            clearInterval(waitForPage);
            createFooter(pageContent);
            console.log('Shared footer loaded in pageContent');
        }
    }, 50);

    // wait for 5 second to ensure the pagecontent
    setTimeout(function () {
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) {
            console.warn('Footer: pageContent not found after 5s');
        }
    }, 5000);
});

function createFooter(container) {
    const footer = document.createElement('footer');
    footer.className = 'page-footer';

    const hr = document.createElement('hr');
    hr.className = 'footer-line';

    const badges = document.createElement('div');
    badges.className = 'footer-badges';

    const clubBadge = document.createElement('span');
    clubBadge.className = 'badge blue';
    clubBadge.textContent = 'UTAR E-SPORTS';

    const versionBadge = document.createElement('span');
    versionBadge.className = 'badge green';
    versionBadge.textContent = 'v2.0';

    const pageBadge = document.createElement('span');
    pageBadge.className = 'badge yellow';
    pageBadge.textContent = 'E-sports Club';

    badges.appendChild(clubBadge);
    badges.appendChild(versionBadge);
    badges.appendChild(pageBadge);

    const description = document.createElement('p');
    description.className = 'text-muted text-small footer-text';
    description.textContent = 'UTAR E-SPORTS CLUB • Fight for Glory!';

    footer.appendChild(hr);
    footer.appendChild(badges);
    footer.appendChild(description);

    //last session in pagecontent
    container.appendChild(footer);

    console.log('Footer added to pageContent');
}